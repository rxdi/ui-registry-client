

Use with `global` registry
```bash
registry add './src/**/*.ts' --url https://ui-registry.graphql-server.com/upload
```

Use with `private` registry
Defaults to `http://localhost:9000/upload`
```bash
registry add './src/**/*.ts'
```


Use with custom configuration registry
```bash
registry set \
'{"token":"083adcacfa9ea952e","registry":"https://ui-registry.graphql-server.com/upload"}'
```

This command will generate `config.json` inside `~/home/.rxdi/config.json` with content

```json
{
  "token": "083adcacfa9ea952e",
  "registry": "https://ui-registry.graphql-server.com/upload"
}
```

This configuration will be taken everytime `registry add` command is executed.