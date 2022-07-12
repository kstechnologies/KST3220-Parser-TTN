# KST3120 Packets Types

## Uplink

One payload is sent with both Battery, Switch, and Error packets concatenated.

Check the documentation in the Javascript Parser for more detail.

Example: `007801FF00820208F1FFFF0100`

| Packet Type | Key      | Length | Value    | Decoded Value |
|-------------|----------|--------|----------|---------------|
| Battery     | `0x0078` | `0x01` | `0xFF`   | 3.05V         |
| Distance    | `0x082`  | `0x02` | `0x08F1` | 2289mm        |
| Error       | `0xFFFF` | `0x01` | `0x00`   | No Error      |


## Downlink

A downlink payload can be sent to change the uplink interval time in minutes.
**FPort** 2 is used for sending a Downlink.
Valid range for Uplinks is `0x01` to `0x240`. Which equals to 1 minute to 240 minutes (4 hours)

Example: `0100011E` = Set Uplink Interval to 30mins

| Packet Type     | Key      | Length | Value  | Decoded Value |
|-----------------|----------|--------|--------|---------------|
| Uplink Interval | `0x0100` | `0x01` | `0x1E` | 30 Minutes    |


## Battery Lookup Table

| Voltage | Sensed Battery | Percent Remaining |
|---------|----------------|-------------------|
| 2.75v   | 202            | 5%                |
| 2.80v   | 212            | 20%               |
| 2.85v   | 222            | 70%               |
| 2.90v   | 232            | 85%               |
| 2.95v   | 244            | 90%               |
| 3.00v   | 254            | 100%              |
| 3.05v   | 255            | 100%              |

## Error States

| Example      | Key      | Length | Value  | Notes                                           |
|--------------|----------|--------|--------|-------------------------------------------------|
| `0xFFFF0100` | `0xFFFF` | `0x01` | `0x00` | No Error                                        |
| `0xFFFF0101` | `0xFFFF` | `0x01` | `0x01` | Insufficient Ambient Light Level for Reading    |
| `0xFFFF0102` | `0xFFFF` | `0x01` | `0x02` | Insufficient Reflective Light Level for Reading |
| `0xFFFF0103` | `0xFFFF` | `0x01` | `0x03` | Unknown Error; Cannot Read Distance             |