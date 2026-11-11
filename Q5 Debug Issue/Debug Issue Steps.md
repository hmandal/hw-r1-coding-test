5. Diagnose Duplicate Orders

Possible fix:
1. disable submit btn: from client i.e. react side - use a unique idenpotency key header and disable the submit button until api response to avoid multiple clicks.
2. db side: add unique constraint to the index on customer id and idempotency key.
3. message for order that can't be found: indicates that message is sent and then txn failed but the message is still sent. Solve this using Outbox pattern and combine both the db txn and the message broker msg in the same Outbox table, so that if they suceed or fail tohether. 


