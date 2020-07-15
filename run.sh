# Execute run and browse to these pages:
#   dist/react-spectrum/SearchField.html
#   dist/react-spectrum/Checkbox.html
#
# SearchField is missing a CSS sibling (and therefore the text isn't centered)
# See run.sh for the resulting graph (Searchfield.mdx's bundleGroup should contain the CSS bundle as well)
#

PARCEL_WORKER_BACKEND=process yarn parcel build --no-cache --no-source-maps --no-minify --no-scope-hoist \
  packages/@react-spectrum/checkbox/docs/Checkbox.mdx \
  packages/@react-spectrum/searchfield/docs/SearchField.mdx
