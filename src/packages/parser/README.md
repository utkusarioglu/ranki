# Parser

This parser has the unenviable task of maintaining compatibility with thousands of cards I have created over the years while adding some new features.

I'm not in love with the syntax but it'll do its job just fine.

## Frame

Frames provide a "frame" for plugins to parse and render. A `code` frame may be handled by a combination of HTML `<code>` element and HighlightJS while a `score` frame may be parsed by a custom yaml to xml parser and rendered by Open Sheet Music Display.

### Naming convention

I have struggled with coming up with good names for the classes of arguments frames accept. I wanted to ensure that:

1. There is no lexical conflict between this parser and domains in the vicinity it operates, such as DOM, HTML, JS and alike
1. The names do not repurpose common CS terms such as config, setting, customization, parameter, argument, input and similar.

I eventually decided on using geography to dictate the names for the argument classes for frames:

```ranki
:::fr, left; right; payload :::
```

or, `l`, `r`, and `p` respectively. This is how OhmJS parser names them as well.

`left` provides arguments for the frame itself. As examples: it may specify a template, or whether the frame will respect the width and height of the viewport. It provides arguments for what's on its left, which is the name of the frame.

`right` provides arguments for the parsing rendering pipeline for the payload. It provides arguments for what's on its right: the payload. As an example, for a `code` frame, it may tell HighlightJS that the language is JavaScript and that PrettierJS should be turned off:

```ranki
:::code; js, !p
// js code
:::
```

If the code frame needs to be forced to be inline, that can be done with a left param:

```
:::code, i; js, !p
// one liner js code
:::
```

### Inline

Inline frames are generally content that go along with HTML inline elements such as different kinds of text, math, standalone musical notation and alike.

Inline shall not support any line breaks for its general structure and for `left` and `right` params but it will allow new lines for the payload.

How new lines are dealt with within the payload will be up to the particular rules of the frame.

New lines for `payload` can be useful for tools such as Latex where the following shape may come up in an inline context:

```latex
\textstyle
  \begin{matrix}
  x & y \\
  z & t
  \end{matrix}
```

Though, maybe it shouldn't...

#### Supported Inline frames

These are the supported inline frames:

- `e` (Empty)
- `p` (Payload)
- `l` (Left)
- `lp` (Left and Payload)
- `lrp` (Left, Right and Payload)
- `rp` (Right and Payload)

The following are not supported:

- `r` (Right)
- `lr` (Left Right)

#### `e` (Empty)

No left, no right, no payload declaration. This one would be useful for elements like `<hr>` or `placeholder`.

```ranki
:::fr:::
```

#### `p` (Payload)

No left, no right, only payload. This frame is used a lot for content that can easily be styled by CSS, such as `<var>`.

The benefit of this configuration comes from being able to avoid characters such as `<` and `/` which are hard to reach in most mobile keyboards.

```ranki
:::fr; p :::
```

#### `l` (Left)

Left and payload

```ranki
:::fr, l :::
```

```ranki
:::fr, l; p :::
```

#### `lrp` (Left, Right and Payload)

Left, right and payload.

```ranki
:::fr, l; r; p :::
```

#### `lr` (Left and Right)

Left and right configuration is not supported as `lr` and `lp` are indistinguishable in most cases.

If you really need `lr`, you can create a `lrp` with an empty `p`.

```ranki
:::fr, l; r; :::
```

#### `r` (Right)

Right and payload

```ranki
:::fr; r :::
:::fr; r; p :::
```

### Observations about inline frames

Inline frames shall not support line breaks anywhere within the frame declaration. The clutter this may create will be mitigated with shorthand left and right param names.

Payload _can_ support new lines but this shall be handled by the parser of the frame. Which could ignore them or enforce its own policies.

### Order of determination:

This is the order in which the parser shall determine what kind of inline frame it is working with:

1. `lrp`
1. `rp`
1. `p`
1. `lp`
1. `l`
1. `e`

### Block

A block is essentially an HTML block element of some sort. Because new lines are significant for the syntax, a frame block declaration can assume quite a few equivalent but visually distinct configurations.

#### Supported block frames

- `lrp` (Left, Right and Payload)
- `rp` (Right and Payload)
- `p` (Payload)
- `lp` (Left and Payload)
- `l` (Left)

The following are not supported

- `e` (Empty)
- `r` (Right)
- `lr` (Left Right)

#### `e` Empty

Frame blocks do not support no left, no right, no payload declarations. Mainly because I cannot imagine a use for them.

#### `r` (Right)

Right blocks are not supported because if a frame defines no content, it has no need to define behavior for it.

#### `lr` (Left and Right)

Left and right without payload is not supported for two reasons:

1. Parser cannot distinguish between right and payload in most cases
1. If there is no content, there is no need for right params. This is similar to why `r` is not supported.

#### `p` (Payload)

Only payload. Many declarations such as `mermaid` use this right now.
Behavior of this particular configuration needs to remain consistent with Ranki v1.

```ranki
:::fr
d
:::
```

#### `l` (Left)

Only left, no right, no payload. This likely will be used with externally
controlled objects such as maps.

```ranki
:::fr,
l
:::
```

```ranki
:::fr, l
:::
```

The `,` (`left_sep`) is required to distinguish `l` from `r` variants.

##### Example:

```ranki
:::google maps,
latitude = 10.4455
longitude = 29.4434
altitude = 4000
:::
```

#### `rp` (Right and payload)

This is used extensively by frames such as `pre code`. It is essential that its behavior remain consistent with Ranki v1.

##### Legal

```ranki
:::fr; r;
p
:::
```

```ranki
:::fr; r
p
:::
```

##### Illegal

Would clash with languages that use `;`

```ranki
:::fr;
r;
p
:::
```

Indistinguishable from content

```ranki
:::fr;
r

p
:::
```

```ranki
:::fr
r

p
:::
```

```ranki
:::fr
r;
p
:::
```

Notice that `rp` does not need to provide `;` (`right_sep`) like `lp` and `lrp` does.

##### Example

```ranki
:::pre code; py
// Python code
```

The configuration above is what is used more than 99% of the time.

#### `lrp` (Left, Right and Payload)

Params, args, and payload, it uses all the fields in a block frame.

```ranki
:::fr, l; r;
p
:::
```

```ranki
:::fr, l; r; p
:::
```

```ranki
:::fr, l;
r;
p
:::
```

```ranki
:::fr, l;
r

p
:::
```

```ranki
:::fr,
l;
r;
p
:::
```

```ranki
:::fr,
l;
r

p
:::
```

```ranki
:::fr,
l

r

p
:::
```

##### Example

In this example we have a code block that turns off _line numbers_ and PrettierJS while rendering JavaScript code.

It also features a `placeholder` inline frame named `insert_here`, which acts as a target for some other frame which specifies `target = insert_here` in its right param to paste its payload.

This is useful when a piece of code needs to both be rendered in its native tool and as human-readable code. A tangible example of this would be: the question could be a Latex rendered piece of math while the answer could be the code that needs to be written to create the displayed mathematics.

```ranki
:::code,
!line_num

javascript, !pretty

function someFunc() {
    const someVar = 5;
    :::placeholder, name = insert_here, indent = 4 :::
    return someVar;
}
:::
```

### Block

#### Distinguishing a frame block from frame inline

Every frame block takes at least two lines. In its most stripped down configuration, the new line comes before the frame terminator:

```ranki
:::fr
:::
```

Though it should be reiterated that empty block frames are illegal. The frame above would at least need to have `left` arguments.

#### Legend for understanding frame notation

The characters for `c` and `s` are chosen after the default values for tokens in Ranki V2.

- `c`: Comma
- `s`: Semicolon
- `l`: Left arguments
- `r`: Right arguments
- `p`: Payload
- Capital letters: Mean that they are on a new line

#### Inline and Block arguments

Arguments have following form in the inline configuration:

```ranki
key1 = value1, key2 = value2;
```

Spaces are ignored. `,` is not. `;` can be optional depending on where it comes in the frame declaration.

Block arguments have the following configuration:

```ranki
key1 = value1,
key2 = value2;
```

Spaces are again ignored. `,` is optional. `;` is required if the frame has a _tight_ configuration and is substituted by a new line in the _loose_ configuration.

Note that block frame versions supported in Ranki V1 expected inline params.

Any half or full expanded configuration switches to the block param configuration. you cannot do something such as:

```ranki
:::fr
key1 = value1,
key2 = value2

key3 = value3, key4 = value4

payload
:::
```

The parser will throw with this syntax.

In short, if a param section is expanded, it needs to switch to the block param configuration.

#### Versions supported in Ranki V1

##### `P` Family

###### `P` (payload block)

```ranki
:::fr
p
:::
```

###### `P` (redundant payload block)

```ranki
:::fr;
p
:::
```

##### `rp` Family

###### `srP` (right inline block)

```ranki
:::fr; r
p
:::
```

###### `srsP` (right inline redundant block)

```ranki
:::fr; r;
p
:::
```

#### New inline versions in V2

##### `p`family

###### `ssP` (double redundant payload block)

This one prevents payload lines from being interpreted as right params

```ranki
:::pr;;
p
:::
```

##### `lrp` family

###### `clsrsP`

```ranki
:::fr, l; r;
p
:::
```

###### `clsrP`

```ranki
:::fr, l; r
p
:::
```

##### `lp` family

###### `clsP`

```ranki
:::fr, l;
p
:::
```

###### `clP`

```ranki
:::fr, l
p
:::
```

#### New block versions in V2

##### `lrp` family

###### `clsRsP` (left right tight half expansion)

```ranki
:::fr, l;
r;
p
:::
```

###### `clsRP` (left right loose half expansion)

```ranki
:::fr, l;
r

p
:::
```

###### `cLsRsP` (tight full expansion)

```ranki
:::fr,
l;
r;
p
:::
```

###### `cLRP` (loose full expansion)

```ranki
:::fr,
l

r

p
:::
```

##### `rp` family

###### `sRsP` (right tight expansion)

```ranki
:::fr;
r;
p
:::
```

###### `sRP` (right loose expansion)

```ranki
:::fr;
r

p
:::
```

##### `lp` family

###### `clsP` (left tight expansion)

```ranki
:::fr,
l;
p
:::
```

###### `cLP` (left loose expansion)

```ranki
:::fr,
l

p
:::
```

#### Escape hatch mechanism

There will definitely be cases where any of the block configurations such as `c_l_r_p` will clash with payload. Especially if the payload is some kind of a coding language which uses tokens such as `=`, `,` and `;`.

In cases like these, a helper mechanism in the shape of two nested frames named `left` and `right` can be used to provide their respective params. As an example, `c_l_r_p`, which normally looks like this:

```ranki
:::fr,
l

r

p
:::
```

would become:

```ranki
:::fr
  :::left
  l
  :::

  :::right
  r
  :::

  p
:::
```

Indentation is optional but it helps with readability.

This is also useful if the frame expects lots of parameters, or expects parameters which are better suited to a format beyond what the _kv_ param features in Ranki V2 support.

```ranki
:::fr
  :::right, yaml
  yaml:
    code:
      - here
  :::

  p
:::
```

#### Parser implementation

Parser for block frames will implement these different configurations as alternations.

A version which used optional expressions for separators and new lines do not allow disabling configurations if they prove to fail real-world payload challenges.

Also, attaching a name for each configuration may be useful for both parsing and validation steps. Some frames may choose to refuse certain configurations. `left` and `right` frame blocks are a prime example of frames which would benefit from such a feature.
