#!/bin/bash

set -ex

if [ "$1" = "encrypt" ]
then
    echo "Encrypting .env to .env.encrypted"
    openssl enc -aes-256-cbc -salt -in .env -out .env.encrypted
else
    openssl enc -d -aes-256-cbc -in .env.encrypted -out .env -pass pass:$1
fi