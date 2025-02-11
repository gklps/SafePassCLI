SafePass CLI provides a user-friendly interface with both interactive menus and direct command execution. Each command shows its usage when executed, making it easy for users to learn and use the CLI effectively. 

The CLI can be used in two ways:

1.  Interactive Menu Mode:

```
safepass

```

2.  Direct Command Mode:

User Management:

```
safepass user register                    # Create new account
safepass user login                       # Login to account
safepass user logout                      # Logout from account
safepass user list                        # List all accounts
safepass user switch <email>              # Switch to different account

```

Wallet Operations:

```
safepass wallet create                    # Create new wallet
safepass wallet balance                   # Check wallet balance
safepass wallet send --to <did> --amount <amount>    # Send RBT tokens
safepass wallet receive                   # Show wallet DID for receiving
safepass wallet register-did              # Register DID
safepass wallet setup-quorum              # Setup quorum
safepass wallet add-peer --peer-did <did> --did-type <type> --peer-id <id>    # Add peer

```

Fungible Token Operations:

```
safepass ft create --name <name> --count <count> --tokens <tokens>    # Create FT
safepass ft transfer --to <did> --name <name> --count <count>        # Transfer FT
safepass ft list                          # List all FTs
safepass ft history --token-id <tokenId>  # View FT history

```

NFT Operations:

```
safepass nft create --metadata <path> --artifact <path>              # Create NFT
safepass nft deploy --nft <nftId> --quorum-type <type>              # Deploy NFT
safepass nft transfer --to <did> --nft <nftId> --quorum-type <type> # Transfer NFT
safepass nft list                         # List all NFTs
safepass nft info --nft <nftId>          # Get NFT info
safepass nft history --nft <nftId>       # View NFT history
safepass nft subscribe --nft <nftId>      # Subscribe to NFT

```

Smart Contract Operations:

```
safepass contract create --binary <path> --raw <path> --schema <path>    # Create contract
safepass contract deploy --token <tokenId> --quorum-type <type> --amount <amount>    # Deploy contract
safepass contract execute --token <tokenId> --quorum-type <type>         # Execute contract
safepass contract subscribe --token <tokenId>                            # Subscribe to contract

```

The CLI provides a user-friendly interface with both interactive menus and direct command execution. Each command shows its usage when executed, making it easy for users to learn and use the CLI effectively.
