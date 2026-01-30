#!/bin/bash

pnpm -F backend dev:api > api.log
pnpm -F gps dev > gps.log
pnpm -F gps-ui dev > gps-ui.log
pnpm -F frontend dev > ui.log