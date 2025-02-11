
The CLI can be used in two ways:

1.  Interactive Menu Mode:

```
rubixcli

```

2.  Direct Command Mode:

User Management:

```
rubixcli user register                    # Create new account
rubixcli user login                       # Login to account
rubixcli user logout                      # Logout from account
rubixcli user list                        # List all accounts
rubixcli user switch <email>              # Switch to different account

```

Wallet Operations:

```
rubixcli wallet create                    # Create new wallet
rubixcli wallet balance                   # Check wallet balance
rubixcli wallet send --to <did> --amount <amount>    # Send RBT tokens
rubixcli wallet receive                   # Show wallet DID for receiving
rubixcli wallet register-did              # Register DID
rubixcli wallet setup-quorum              # Setup quorum
rubixcli wallet add-peer --peer-did <did> --did-type <type> --peer-id <id>    # Add peer

```

Fungible Token Operations:

```
rubixcli ft create --name <name> --count <count> --tokens <tokens>    # Create FT
rubixcli ft transfer --to <did> --name <name> --count <count>        # Transfer FT
rubixcli ft list                          # List all FTs
rubixcli ft history --token-id <tokenId>  # View FT history

```

NFT Operations:

```
rubixcli nft create --metadata <path> --artifact <path>              # Create NFT
rubixcli nft deploy --nft <nftId> --quorum-type <type>              # Deploy NFT
rubixcli nft transfer --to <did> --nft <nftId> --quorum-type <type> # Transfer NFT
rubixcli nft list                         # List all NFTs
rubixcli nft info --nft <nftId>          # Get NFT info
rubixcli nft history --nft <nftId>       # View NFT history
rubixcli nft subscribe --nft <nftId>      # Subscribe to NFT

```

Smart Contract Operations:

```
rubixcli contract create --binary <path> --raw <path> --schema <path>    # Create contract
rubixcli contract deploy --token <tokenId> --quorum-type <type> --amount <amount>    # Deploy contract
rubixcli contract execute --token <tokenId> --quorum-type <type>         # Execute contract
rubixcli contract subscribe --token <tokenId>                            # Subscribe to contract

```

The CLI provides a user-friendly interface with both interactive menus and direct command execution. Each command shows its usage when executed, making it easy for users to learn and use the CLI effectively.
