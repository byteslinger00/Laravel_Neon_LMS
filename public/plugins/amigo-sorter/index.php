<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amigo Sorter Plugin (Demo)</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/theme-default.css">
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script src="js/amigo-sorter.min.js"></script>
  <script>
    $( function() {
      $('ul.sorter').amigoSorter();
    });
  </script>
</head>
<body>


  <div class="wrapper">

    <h1 class="text-center">
      Amigo Sorter Plugin (Demo) <img src="images/hand.png" alt="">
    </h1>

    <ul class="sorter center">
      <li>
        <span>Sci-Fi</span>
        <ul class="sorter">
          <li>
            <span>Star Trek</span>
          </li>
          <li>
            <span>Star Wars</span>
          </li>
          <li>
            <span>Minory Report</span>
          </li>
          <li>
            <span>Alien</span>
          </li>
          <li>
            <span>Prometeus</span>
          </li>
        </ul>
      </li>
      <li>
        <span>Fantasy</span>
        <ul class="sorter">
          <li>
            <span>Lord of the Rings</span>
          </li>
          <li>
            <span>Game of Thrones</span>
          </li>
        </ul>
      </li>
      <li>
        <span>Bondiana</span>
        <ul class="sorter">
          <li>
            <span>Casino Royal</span>
          </li>
          <li>
            <span>Quantum of Solace</span>
          </li>
        </ul>
      </li>

    </ul>

    <div class="clearfix"></div>
	
	<a href="http://www.github.com/amigodev/sorter/">Amigo Sorter (github.com)</a>

  </div>

</body>
</html>