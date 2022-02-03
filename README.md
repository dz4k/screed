
Screed
======

Screed helps you parse text. It can do some things that a lexer can do, but it
doesn't generate tokens. Instead, you read characters directly in your parser.
You can:

  * Read individual characters

    ~~~ js
    if (reader.matchChar('"')) {
      const char = reader.eat()
      ...
    }
    ~~~

  * Match strings

    ~~~ js
    if (reader.matchString("...")) {
    ~~~

  * Match regular expressions

    ~~~ js
    if (reader.matchRegex(/[A-Za-z0-9_\$]+/)) {
    ~~~

I wrote screed in hopes that it could be used for [_hyperscript][].

[_hyperscript]: https://hyperscript.org

