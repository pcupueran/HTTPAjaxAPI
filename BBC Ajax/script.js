// TV Schedule example
$(document).ready(function()
{
  retrieveGenres();
  $(document).on('click', "#genres li", function(){
    var genre = $(this);
    if($(".active").length != 0){
      $(".active").removeClass("active");
    }
    getTomorrowSchedule(genre.attr('id'));
    genre.addClass("active");
  });

}); 


function retrieveGenres(){
  $.ajax({
    url:"http://www.bbc.co.uk/tv/programmes/genres.json",
    dataType: 'json',
    beforeSend: function(){
      
    }
  }).done(function(data){
      showGenres(data.categories);
   
  }).fail(function(xhr,status, error){
      alert("Error: "+xhr.status+": "+xhr.statusText);
  });
}

function showGenres(categories){
  $.each(categories, function( index, value ) {
      $("#genres").append("<li id=" + value.key + "> " + value.title + " </li>");
    });
  
}
function getTomorrowSchedule(genre){
  $.ajax({
    url:"http://www.bbc.co.uk/tv/programmes/genres/" + genre +"/schedules/tomorrow.json",
    dataType: 'json',
    beforeSend: function(){
      $("#programmes").empty();
    }
  }).done(function(data){
      showFilms(data.broadcasts);
  }).fail(function(xhr,status, error){
      alert("Error: "+xhr.status+": "+xhr.statusText);
  });
  
}

function showFilms(broadcasts){
  $.each(broadcasts, function( index, value ) {
    $("#programmes").append(processEpisode(value));
  });
}

function processEpisode(episode){
  item_html =  "<li>";
  item_html += "<h2>" + episode.programme.display_titles.title + "</h2>";
  item_html += "<h4>" + episode.programme.short_synopsis + "</h4>";
  if(episode.programme.image){
    item_html += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/" + episode.programme.image.pid + ".jpg/>";
  }
  else{
    item_html += "<img src=http://placehold.it/272x153/>";
  }
  item_html += "<p> Date: " + formatDate(episode.start,episode.end) + "</p>";
  item_html += "<p> Duration: " + episode.duration/60 + " minutes</p>";
  if(episode.programme.position){
    item_html += '<a href="#" onclick="getUpcomingEpisodies(\'' + episode.programme.programme.pid + '\')">View upcoming Episodies</a>';
  }
  item_html += '<span class="service">' + episode.service.title + '</span>'
  item_html += "</li>";
  return item_html;
}

function getUpcomingEpisodies(pid){
  $.ajax({
    url:"http://www.bbc.co.uk/programmes/" + pid + "/episodes/upcoming.json",
    dataType: 'json',
    beforeSend: function(){
      $("#programmes").empty();
    }
  }).done(function(data){
      showFilms(data.broadcasts);
  }).fail(function(xhr,status, error){
      alert("Error: " + xhr.status + " " + xhr.statusText);
  });
}

function formatDate(start, end) {
  start_date = new Date(start);
  end_date = new Date(end);

  day = start_date.getDate();
  month = start_date.getMonth() + 1; // the returned months are 0-11
  year = start_date.getFullYear();

  start_hour = start_date.getHours();
  start_mins = start_date.getMinutes();

  end_hour = end_date.getHours();
  end_mins = end_date.getMinutes();

  date = day + "/" + month + "/" + year + " ";
  
  // add leading 0 and return last two characters to make sure we use 00:00 format
  date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
           ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2); 
  return date;
}