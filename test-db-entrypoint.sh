#!/bin/sh
neo4j-admin load --from=/test-db.dump
chown -R neo4j:neo4j /data
/docker-entrypoint.sh neo4j
