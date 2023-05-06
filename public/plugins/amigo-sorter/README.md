# Amigo Sorter Plugin

Sortable List Plugin. Sub-tree and mobile touch support.

## Getting Started

Requirements: jquery plugin, ul struct with span inside li for content. Include css and js sorter plugin.

<img src="http://www.amigodev.com/demo/sorter/images/demo.jpg" alt="">

<a href="http://www.amigodev.com/demo/sorter/index_en.php" target="_blank">Demo Page</a>

### Prerequisites

First, we need to include JQuery

```
<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
```

### Installing

We need include css theme file

```
<link rel="stylesheet" href="css/theme-default.css">
```

And js plugin file

```
<script src="js/amigo-sorter.js"></script>
```

## Html sctruct

This struct for simple sortable list

```
<ul class="sorter">
	<li>
		<span>First Item</span>
	</li>
	<li>
		<span>Second Item</span>
	</li>
</ul>
```

Various limitations!!!
For content inside li tags require using span tag.

Font color, background color, paddings etc we can change in theme-default.scss and compile with sass.

Don't forget to call plugin for ul container

```
<script>
	$( function() {
		$('ul.sorter').amigoSorter();
	});
</script>
```

### Callback Functions

onTouchStart : function() {},
onTouchMove : function() {},
onTouchEnd : function() {}

```
<script>
	$( function() {
		$('ul.sorter').amigoSorter({
			onTouchEnd : function() { console.log('drag finish event'); }
		});
	});
</script>
```

