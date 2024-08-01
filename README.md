# sweep

## Bedrock setup

```
composer create-project roots/bedrock
cd bedrock
# set up bedrock repositories here from below snippet
# create .env file (stored in bitwarden)
composer require flyhigh/sweep:dev-main
```



## Bedrock composer repositories
```
"repositories": {
    "sweep-wordpress": {
        "type": "path",
        "url": "../sweep-wordpress"
    },
    "0": {
        "type": "composer",
        "url": "https://wpackagist.org",
        "only": ["wpackagist-plugin/*", "wpackagist-theme/*"]
    },
    "1": {
        "type": "composer",
        "url": "https://connect.advancedcustomfields.com"
    },
    "2": {
        "type": "package",
        "package": {
            "name": "wpml/wpml-multilingual-cms",
            "version": "4.6.11",
            "type": "wordpress-plugin",
            "dist": {
                "type": "zip",
                "url": "https://wpml.org/?download=6088&user_id={%WPML_USER_ID}&subscription_key={%WPML_KEY}&t=1708350777&version={%VERSION}"
            },
            "require": {
                "ffraenz/private-composer-installer": "^5.0"
            }
        }
    },
    "3": {
        "type": "composer",
        "url": "https://packagist.org"
    }
}
```