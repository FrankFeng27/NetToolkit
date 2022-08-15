**** Development issues
1. For nodejs@17.x.x, the following webpack error occurred:
nodejs 17: digital envelope routines::unsupported (https://github.com/webpack/webpack/issues/14532)
And workaround is 
```
export NODE_OPTIONS=--openssl-legacy-provider
```



