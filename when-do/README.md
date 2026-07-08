# `<when-do>` Web Component

_Note: this is an initial, incomplete, README and needs more documentation._

## Description

A non visual web component that wraps you content (or can be inserted as an empty tag) that has an effect when a specific datetime has passed.

## Usage and API

```html
<script src="when-do.mjs" type="module"></script>

<when-do datetime="2023-12-12T12:10" what="show">
  <p>I shall appear after 12th November 2023 at 12:10pm</p>
</when-do>
```

The `when-do` element supports the following attributes:

- `what="show|hide|scroll"` required action to do
- `datetime="isodate"` required, in the format of `2023-12-12T12:00:00`
- `apply` optional className to apply to the web component when the `what` is triggered

## Initial styles

For the component to work without JavaScript (i.e. if it's interrupted or fails for any reason), be sure to include the following CSS to ensure the hidden elements start in the right state:

```css
when-do[what="hide"] {
  display: none;
}
```

If you want to fade in when showing, you will need to apply opacity to the `what-do` direct descendants. Note that you can't apply the `opacity: 0` to the `what-do` because it uses `display: contents` which can't be styled. Here's an example:

```css
when-do[what='show'][apply='fade-in'] {
  & > * {
    transition: opacity 0.5s ease-in-out;
    opacity: 0;
  }

  &.fade-in > * {
    opacity: 1;
  }
}
```

## TODO

- Support relative times, such as `datetime="2023-12-12T12:10 1d"`
- Fix so that the most recently passed event fires, rather than the last found web component
- Optimise code (i.e. only run code on state change)
- Add examples
- Probably more here

## License

- [MIT](https://rem.mit-license.org/)
