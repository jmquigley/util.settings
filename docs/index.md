<a name="module_Settings"></a>

## Settings

* [Settings](#module_Settings)
    * [.Settings](#module_Settings.Settings)
        * [new exports.Settings()](#new_module_Settings.Settings_new)
        * _instance_
            * [.noProxyRoot](#module_Settings.Settings+noProxyRoot) ⇒
            * [.root](#module_Settings.Settings+root) ⇒
            * [.sections](#module_Settings.Settings+sections) ⇒
            * [.clear()](#module_Settings.Settings+clear)
            * [.register(configs)](#module_Settings.Settings+register) ⇒
            * [.removeKey(section, key)](#module_Settings.Settings+removeKey)
        * _static_
            * [.instance(reset)](#module_Settings.Settings.instance) ⇒

<a name="module_Settings.Settings"></a>

### Settings.Settings
**Kind**: static class of [<code>Settings</code>](#module_Settings)  

* [.Settings](#module_Settings.Settings)
    * [new exports.Settings()](#new_module_Settings.Settings_new)
    * _instance_
        * [.noProxyRoot](#module_Settings.Settings+noProxyRoot) ⇒
        * [.root](#module_Settings.Settings+root) ⇒
        * [.sections](#module_Settings.Settings+sections) ⇒
        * [.clear()](#module_Settings.Settings+clear)
        * [.register(configs)](#module_Settings.Settings+register) ⇒
        * [.removeKey(section, key)](#module_Settings.Settings+removeKey)
    * _static_
        * [.instance(reset)](#module_Settings.Settings.instance) ⇒

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
<a name="module_Settings.Settings+clear"></a>

#### settings.clear()
Removes all settings.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
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

<a name="module_Settings.Settings+removeKey"></a>

#### settings.removeKey(section, key)
Removes a key from a section within the settings.

**Kind**: instance method of [<code>Settings</code>](#module_Settings.Settings)  
**Params**

- section <code>string</code> - the section where the key is located
- key <code>string</code> - the key that will be delete from the section

<a name="module_Settings.Settings.instance"></a>

#### Settings.instance(reset) ⇒
A factory method that retrieves the instance of the settings object.
It uses a promise to retrieve the instance. The promise resolves to
the reference to the instance object.  This is a singleton pattern
so repeated calls to this method will resolve to the same instance
unless the reset flag is set to true.

**Kind**: static method of [<code>Settings</code>](#module_Settings.Settings)  
**Returns**: a Promise that resolves to the instance object for the
settings.  
**Params**

- reset <code>boolean</code> <code> = false</code> - if true, then generate a new instance
of the settings.  Typically this should not be used and was only
added to aid in testing.

