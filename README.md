# README #

Readme document made for xdevs.hu site, basic description, config, setup, deployment guide.

### What is this repository for? ###

Holding base project which generates static page served by a web server.

### How do I get set up? ###

#### For Ubuntu

```
sudo apt-get install ruby-full
```

#### For Arch

```
sudo pacman -Syu ruby
```

Add Ruby Gems to your Path variables like so:

```
PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"
```
Add these lines to your user profile's .bashrc file too, to keep these.

From this point, ruby usage is the same for both distro types.

```
gem install bundler
```

```
bundle install
```

If installing fails, because of a missing gem with a specific version, try:

```
bundle update
```



```
bundle exec jekyll build
```



* Deployment instructions

Execute in directory to create _site directory:
```
bundle exec jekyll build 
```
Copy _site directory into the preferred web server

### Usage guidelines ###

* usage placeholder