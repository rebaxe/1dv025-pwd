# &lt;my-flipping-tile&gt;

A web component that represents a flipping tile.

## Attributes

### `hidden`

A Boolean attribute. If the attribute is present, the user is unable to interact with the element.

Default value: undefined

### `faceup`

A Boolean Attribute. If the attribute is present, the element's front is displayed.

Default value: undefined

### `inactive`

A Boolean attribute. If the attribute is present, the element's inner part is hidden and a dashed outline is rendered.

Default value: undefined

## Events

| Event Name      | Fired When                        | 
| --------------- | --------------------------------- |
| `flip`      | A tile is clicked or selected with keyboard (space or enter) if the tile's attribute is not inactive or hidden.                |

## Example

```html
<my-flipping-tile></my-flipping-tile>
<my-flipping-tile hidden></my-flipping-tile>
```