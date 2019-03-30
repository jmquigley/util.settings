<a name="module_Settings"></a>

## Settings

* [Settings](#module_Settings)
    * [.Settings](#module_Settings.Settings)
        * [new exports.Settings()](#new_module_Settings.Settings_new)
        * _instance_
            * [.noProxyRoot](#module_Settings.Settings+noProxyRoot) ⇒
            * [.root](#module_Settings.Settings+root) ⇒
            * [.sections](#module_Settings.Settings+sections) ⇒
            * [.applyProxyToRoot()](#module_Settings.Settings+applyProxyToRoot)
            * [.init()](#module_Settings.Settings+init) ⇒
            * [.parseCompositeKeyAndSet(compositeKey)](#module_Settings.Settings+parseCompositeKeyAndSet) ⇒
            * [.register(configs)](#module_Settings.Settings+register) ⇒
            * [.save(path, value, previousValue)](#module_Settings.Settings+save)
        * _static_
            * [.instance()](#module_Settings.Settings.instance) ⇒

<a name="module_Settings.Settings"></a>

### Settings.Settings
**Kind**: static class of [<code>Settings</code>](#module_Settings)  

* [.Settings](#module_Settings.Settings)
    * [new exports.Settings()](#new_module_Settings.Settings_new)
    * _instance_
        * [.noProxyRoot](#module_Settings.Settings+noProxyRoot) ⇒
        * [.root](#module_Settings.Settings+root) ⇒
        * [.sections](#module_Settings.Settings+sections) ⇒
        * [.applyProxyToRoot()](#module_Settings.Settings+applyProxyToRoot)
        * [.init()](#module_Settings.Settings+init) ⇒
        * [.parseCompositeKeyAndSet(compositeKey)](#module_Settings.Settings+parseCompositeKeyAndSet) ⇒
        * [.register(configs)](#module_Settings.Settings+register) ⇒
        * [.save(path, value, previousValue)](#module_Settings.Settings+save)
    * _static_
        * [.instance()](#module_Settings.Settings.instance) ⇒

<a name="new_module_Settings.Settings_new"></a>

#### new exports.Settings()
Empty private construtor that forces the use of the .instance method
to get a reference to the settings.

<a name="module_Settings.Settings+noProxyRoot"></a>

#### settings.noProxyRoot ⇒
**Kind**: instance property of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: the read only root object without the proxy overlay  
<a name="module_Settings.Settings+root"></a>

#### settings.root ⇒
**Kind**: instance property of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a reference to the settings object that is proxy wrapped  
<a name="module_Settings.Settings+sections"></a>

#### settings.sections ⇒
**Kind**: instance property of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: the list of sections contained in the settings  
<a name="module_Settings.Settings+applyProxyToRoot"></a>

#### settings.applyProxyToRoot()
Reapplies the change proxy on the raw settings object.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
<a name="module_Settings.Settings+init"></a>

#### settings.init() ⇒
Initializes the object when the instance is first created.  This has to
happen outside of the constructor.  This will retrieve all of the current
composite keys from the store and process them.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a Promise that resolves to an initialized settings instance.  
<a name="module_Settings.Settings+parseCompositeKeyAndSet"></a>

#### settings.parseCompositeKeyAndSet(compositeKey) ⇒
Takes a localforage composite key, parses it into its section and key,
retrieves the value for that composite key, and sets the section/key
in the root object.  A composite key has the following format:

    "{section}.{key}"  e.g. general.debug

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a Promise object that will parse and set a new key/value pair  
**Params**

- compositeKey <code>string</code> - the composite key that will be parsed
and saved in the root object.

<a name="module_Settings.Settings+register"></a>

#### settings.register(configs) ⇒
Adds a new configuration section to the settings.  The function
expects the input to use the SectionConfig interface.  It can
take a single configuration item or an array of items.  The
Section config is composed of two fields: name and default.
The name represents the section that will be added to the
top level of the settings.  The default attribute contains an
object with key/value pairs that represent the initial default
values for settings within that section.  All settings must be
present within the default.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a reference to the settings proxy object (root).  
**Params**

- configs <code>SectionConfig</code> - a new section to add to the
settings object.

<a name="module_Settings.Settings+save"></a>

#### settings.save(path, value, previousValue)
This method is called by the proxy when a property of the root object
is changed.  This will persiste that setting key/valu into the
localforage.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
**Params**

- path <code>string</code> - the "." separate path from the root to the key;
in the object where the save happened.  This generates a unique key
value that will be used in the save.
- value <code>any</code> - the value that will be saved into localforage
- previousValue <code>any</code> - the current value before the save

<a name="module_Settings.Settings.instance"></a>

#### Settings.instance() ⇒
A factory method that retrieves the instance of the settings object.
It uses a promise to retrieve the instance.  The promise resolves to
the refernce to the instance object.

**Kind**: static method of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a Promise that resolves to the instance object for the
settings.  
