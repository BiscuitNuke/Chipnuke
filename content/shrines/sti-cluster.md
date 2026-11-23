---
title: STI cluster on the bench
part: U2
date: 2026-11-23
summary: A 2017 WRX STI gauge cluster driven by sim racing telemetry.
tags: car, esp32, can
---
I've got a 2017 WRX STI instrument cluster sitting on my bench. Goal: make it act like it's in a real car, driven by Forza Horizon 6 telemetry.

The plan is an ESP32 and a CAN bus breakout, based on the r00li/CarCluster project.

I had this working once. RPM and speed were live, every warning light lit up. Then I lost all the code and notes. So now I'm doing it again, and this time it's getting written down here.
