/** 
 * @file     KST3220-Parser-TTN.js
 * @brief    Parser for KST3220 for use on The Things Network (TTN)
 * @author   BK
 * @author   DS
 * @author   CW
 * @version  1.1.0
 * @date     2023-07-05
 */
/* {{{ ------------------------------------------------------------------ */
/** 
 * @licence
 * Copyright (c) 2019 - 2023, KS Technologies, LLC
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form, except as embedded into a KS Technologies
 *    product or a software update for such product, must reproduce the above 
 *    copyright notice, this list of conditions and the following disclaimer in 
 *    the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of KS Technologies nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 * 
 * 4. This software, with or without modification, must only be used with a
 *    KS Technologies, LLC product.
 * 
 * 5. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 * 
 * THIS SOFTWARE IS PROVIDED BY KS TECHNOLOGIES LLC "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KS TECHNOLOGIES, LLC OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
/* ------------------------------------------------------------------ }}} */

function decodeUplink(input) {

    /*
    Here is an example of an uplink with battery as a percentage-
    00 78 01 FE 00 82 02 08 F1 FF FF 01 00
     0  1  2  3  4  5  6  7  8  9 10 11 12

    Decoded, that appears as ...
    * Battery: 0xFE > 254 (maximum!)
    * Distance: 0x08F1 > 2289mm
    * Error: 0x00 > No Error
    
    Here is an example of an uplink with battery as voltage-
    00 78 02 0B FE 00 82 02 08 F1 FF FF 01 00
     0  1  2  3  4  5  6  7  8  9 10 11 12 13

    Decoded, that appears as ...
    * Battery: 0x0BFE > 3.007V
    * Distance: 0x08F1 > 2289mm
    * Error: 0x00 > No Error

    TTN offers the ability to test your decoder. It is encouraged
    that you paste the Byte-level examples above and ensure your
    decoder is correct before deploying to your server.
    */

    // Get the incoming bytes
    var bytes = input.bytes;

    // Initialize variables
    var batteryFloat = 0xFFFF;
    var error = 0;
    
    // Initialize variables
    var distanceInt = 0xFFFF;
    
    if(bytes[2] == 2) // battery in voltage payload
    {
      // Battery (mV): Mask to make sure your final answer is just 2-bytes
      batteryMSB = bytes[3];
      batteryLSB = bytes[4];
      batteryInt = (batteryMSB << 8) | batteryLSB;
      batteryFloat = batteryInt/ 1000;

      // Distance (mm) 
      distanceMSB = bytes[8];
      distanceLSB = bytes[9];
      distanceInt = (distanceMSB << 8) | distanceLSB
  
      // JSON Packet gets set to the server
      return {
          data: {
              battery: batteryFloat,
              distance: distanceInt,
              error: error
          }
      };    
    }
    else // battery in percentage payload
    {
      // Battery (%): Mask to make sure your final answer is just 2-bytes
      batteryFloat = 100.0 * (bytes[3] / 254.0);
      if (batteryFloat == 0xFF) {
          error = 1;
      } 
      
      // Distance (mm) 
      distanceMSB = bytes[7];
      distanceLSB = bytes[8];
      distanceInt = (distanceMSB << 8) | distanceLSB

      // JSON Packet gets set to the server
      return {
          data: {
              battery: batteryFloat,
              distance: distanceInt,
              error: error
          }
      };
  }  
}