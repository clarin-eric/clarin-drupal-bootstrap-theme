# CLARIN Bootstrap Barrio sub-theme for Drupal 10.

The CLARIN theme for Drupal 10 is a sub-theme of [Bootstrap Barrio](https://www.drupal.org/project/bootstrap_barrio) Bootstrap 5 theme.

Here you will find the sub-theme distribution files and releases. Additionally, this repository can be used as a [composer VCS](https://getcomposer.org/doc/05-repositories.md#vcs), see bellow for details.

This repository is NOT used for development. The sub-theme sources are maintained at the [sub-theme source repository](https://github.com/clarin-eric/clarin-drupal-bootstrap-theme). All commits to this repository are automatically pushed by the corresponding CI build of the source repository.

## Installation

### Using composer:

#### Set up composer:

* To configure `composer` to use this repository as VCS add the following to the `repositories:` section of your website's `composer.json` file:

```
"repositories": [
    {
        "type": "vcs",
        "url": "https://github.com/clarin-eric/clarin-drupal-bootstrap-theme-dist",
        "extra": {
            "branch-alias": {
                "dev-main": "1.0.x"
            }
        }
    }
]
```

* Due to GitHub API rate limitations you might need to create a [GitHub PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) and add it to the `config:` section of your website's `composer.json`:
```
"config": {
    "github-oauth": { "github.com": "<YOUR PAT HERE>" }
},
```

* When installing Bootstrap Barrio via composer, bootstrap is automatically downloaded and copied into vendors directory. See [Boostrap Barrio documentation](https://www.drupal.org/docs/8/themes/barrio-bootstrap-4-drupal-89-theme/bootstrap-barrio-installation/bootstrap-libraries).
To copy `dist` files into libraries directory during installation, add the following lines to the `scripts:` section of your website's `composer.json`:
```
"scripts": {
    "post-install-cmd": [                                          
        "@composer drupal:scaffold"             
    ],
    "post-update-cmd": [
       "@composer drupal:scaffold",
       "mkdir -p web/libraries/bootstrap",
       "cp -R vendor/twbs/bootstrap/dist web/libraries/bootstrap",
       "chown -R root:nginx web/libraries/bootstrap"
    ]
}
```

This will maintain the bootstrap version up to date when updating via composer.

#### Install the theme:
```
composer require drupal/clarin_bootstrap
```

#### Update the theme:
```
composer update drupal/clarin_bootstrap
```

### Manual installation:
  * Install Bootstrap Barrio theme.
  * Unpack and copy the sub-theme on `web/themes/[custom|contrib]` directory.
  * Install Bootstrap Library module (or manually install its JS and CSS libaries ([Download](https://github.com/twbs/bootstrap/releases/download/v4.6.0/bootstrap-4.6.0-dist.zip)) in: `web/libraries/bootstrap/dist/`)

### Install popper.js library in Drupal (applies to both: manual and composer installation types)
  * Popper.js ([Download](https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/)) in. `web/libraries/popper.js/dist/umd/`

## Runtime requirements

Same as the [Bootstrap Barrio](https://www.drupal.org/project/bootstrap_barrio) parent theme:

* bootstrap.min.[js, css]
* popper.min.js (must be manually installed)
