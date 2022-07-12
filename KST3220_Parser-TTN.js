/** 
 * @file     KST3220-Parser-TTN.js
 * @brief    Parser for KST3220 for use on The Things Network (TTN)
 * @author   BK
 * @author   DS
 * @version  1.0.0
 * @date     2022-06-13
 */
/* {{{ ------------------------------------------------------------------ */
/** 
 * @licence
 * Copyright (c) 2019 - 2022, KS Technologies, LLC
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
    The following examples show how to parse the distance uplink.
    KST uses concatenated Key-Length-Value decoding for all of its
    LoRaWAN Uplinks. Following are the keys for the KST3220:
    0x0078 > Battery
    0x0082 > Distance
    0xFFFF > Error State

    Following every 2-byte Key is a 1-byte Length indicating how
    many bytes follow.
    
    And, finally, the Value follows the Length and equal to the
    number of bytes specified in the Length.

    Here is an example of an uplink -
    00 78 01 FF 00 82 02 08 F1 FF FF 01 00
     0  1  2  3  4  5  6  7  8  9 10 11 12

    Decoded, that appears as ...
    * Battery: 0xFF > 255 (maximum!)
    * Distance: 0x08F1 > 2289mm
    * Error: 0x00 > No Error

    The TTN offers the ability to test your decoder. It is encouraged
    that you paste the Byte-level examples above and ensure your decoder
    is correct before deploying to your server.
    */

    // Get the incoming bytes
    var bytes = input.bytes;

    // Initialize variables
    var batteryFloat = 0xFFFF;
    var error = 0;

    // Battery (mV): Mask to make sure your final answer is just 2-bytes
    batteryFloat = 100.0 * (bytes[3] / 254.0);
    if (batteryFloat == 0xFF) {
        error = 1;
    }

    // Initialize variables
    var distanceInt = 0xFFFF;

    // Distance (mm) 
    distanceMSB = bytes[7];
    distanceLSB = bytes[8];
    distanceInt = (distanceMSB << 8) | distanceLSB;

    // JSON Packet gets set to the server
    return {
        data: {
            battery: batteryFloat,
            distance: distanceInt,
            error: error
        }
    };
}