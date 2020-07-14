# PARCEL_WORKER_BACKEND=process yarn parcel --no-cache --no-hmr --no-source-maps \
PARCEL_WORKER_BACKEND=process yarn parcel build --no-cache --no-source-maps --no-minify --no-scope-hoist \
  packages/@react-spectrum/checkbox/docs/Checkbox.mdx \
  packages/@react-spectrum/searchfield/docs/SearchField.mdx
