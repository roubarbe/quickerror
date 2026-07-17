# QuickError



### What is it?

QuickError is a small web component you can just add to any static page.

To me: its uses are mostly limited to testing APIs, fetch requests, etc.



### How do I set it up?

First, make sure the quickerror.js file is imported/linked in your HTML file or project:

```html
<script src="quickerror.js"></script>
```



Then, in the body of your page: simply add a quick-error element:

```html
<quick-error 
    onscreen 
    errtitle="Title is an error" 
    errmessage="Title isn't valid, but this message ain't neither">
</quick-error>
```



You'll notice there are three attributes in the previous example. All three are important:

**onscreen**: makes it appear on screen. Removing it makes the message disappear.

**errtitle**: defines the title shown.

**errmessage**: defines the message.



You can then define and change any of these attributes at any moment using HTML or JavaScript!


