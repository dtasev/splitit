#!/bin/bash

set -ex

# needs openssl 1.1.1 for -pbkdf2 -iter,
# although to encrypt was used OpenSSL 3.0.11 19 Sep 2023 (Library: OpenSSL 3.0.11 19 Sep 2023)

if [ "$1" = "encrypt" ]
then
    echo "Encrypting .env to .env.encrypted"
    openssl enc -aes-256-cbc -md sha512 -pbkdf2 -iter 10000000 -salt -in .env -out .env.encrypted
else
    openssl enc -d -aes-256-cbc -md sha512 -pbkdf2 -iter 10000000 -in .env.encrypted -out .env -pass pass:$1
fi