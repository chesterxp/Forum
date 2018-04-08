//-----------------nav------------------

// $('#navBox').hide();
$('.mobiBtn').on('click', function(){
    $('.navBox').toggleClass("show");
})

//animate a
$('a[href^="#"]').on('click', function(event) {
	
		var target = $( $(this).attr('href') );
	
		if( target.length ) {
			event.preventDefault();
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 1000);
		}
	});

//show/hide elements

$('*[data-animate]').addClass('hide').each(function(){
    $(this).viewportChecker({
      classToAdd: 'show animated ' + $(this).data('animate'),
      classToRemove: 'hide',
      offset: '30%'
    });
  });

//----------------------player---------------------

//--mobile version
if(screen.width <= 800 ){
    $('body').addClass('mobile');
}
var isMobile = $('body').is('.mobile');

// console.log(isMobile);

$('#pause').hide();

var newAudio = new Audio('audio/Track-01.mp3');
var oldAudio = new Audio('audio/Track-01.mp3');
var newSong = false;
var startPlay = false;


//first song init
playMusic($('#playlist .song').eq(0));

function playMusic(element){
    
    if(element.length > 0){
        var self = $(element);
    }
    else{
        var self = $(this);
    }
    var song = self.attr('song'),
        title = self.find('.titleOfSong').text(),
        band = self.find('.artist').text(),
        time = self.find('.time').text(),
        foto = self.attr('foto');
        url = 'url(../img2/small/'+foto+')';
        oldAudio = newAudio;

    $(' #fullTime').text(time);
    $('.titleBox .title').text(title);
    $('.titleBox .band').text(band);
    $('#songFoto').css('background', url);

    newAudio = new Audio('audio/'+song);
    $('#playlist .song').removeClass('active');
    self.addClass('active');
    $('#pause').show();
    $('#play').hide();

    //dont start playing after reload page
    if(startPlay == true){
        oldAudio.pause();
        newAudio.play();     
    }
    else{
        $('#pause').hide();
        $('#play').show();
    }
    startPlay = true; 

    showDuration();

    if($('body').is('.mobile')){
        $('#playlist').hide(500);
    }
    //dont change progresBar within playing song
    newSong == true;
}
function showDuration(){
    $(newAudio).bind('timeupdate', function(){
        var s = parseInt(newAudio.currentTime%60);
        var m = parseInt((newAudio.currentTime/60)%60);
        var a = 0;
        if(s < 10){
            s = "0" + s;
        }
        if(m <10){
            m = "0" + m;
        }
        $('#duration').html(m+":"+s);
        var fullTime = parseFloat(newAudio.duration/60,10);
        var minutes = parseFloat(newAudio.duration/60, 10);
        var secound = (newAudio.duration%100);
        var value = 0;

        if(newAudio.currentTime > 0){
            value = Math.floor((100/newAudio.duration)*newAudio.currentTime);
        }

        $('#lineColor').css('width', value+'%');
        if(newAudio.currentTime == newAudio.duration){
            next();
        }
    })
}
function resetDuration(){
    $('#lineColor').width(0);
}
function play(){
    oldAudio.pause();
    newAudio.play();
    $('#play').hide();
    $('#pause').show();
    $('#duration').fadeIn('400');
    showDuration();
    if(newSong == true){
        resetDuration();
    }
    newSong = false;
}
function pause(){
    newAudio.pause();
    $('#pause').hide();
    $('#play').show();
    $('#duration').fadeIn('400');
}
function prev(){
    newAudio.pause();
    var prev = $('#playlist .song.active').prev();
    if(prev.length == 0){
        prev = $('#playlist .song:last-child');
    }
    playMusic(prev);
    newAudio.play();
    $('#pause').show();
    $('#play').hide();
    showDuration();
}
function next(){
    newAudio.pause();
    var next = $('#playlist .song.active').next();
    if(next.length ==0){
        next = $('#playlist .song:first-child');
    }
    playMusic(next);
    newAudio.play();
    $('#pause').show();
    $('#play').hide();
    showDuration();
}

$('#buttonBox .button').on('click', function(){
    var btn = $(this).attr('id');
    switch(btn){
        case 'prev':
        prev();
        break;
        case 'play':
        play();
        break;
        case 'pause':
        pause();
        break;
        case 'next':
        next();
        break;
        default:
        console.log('upssss!')
    }
})
$('#playlist .song').click(playMusic);
$('#playListButton').click(function(){
    $('#playlist').slideDown();
})

$('#backPlayList').click(function(){
    $('#playlist').slideUp();
})
$('#volume').change(function(){
    newAudio.volume = parseFloat(this.value / 100);
})
$('#lineTime').click(function(e){
    var width = $(this).width();
    var momentOfSong = e.clientX;
    var start = $('#lineColor').offset().left;
    //change width of progressBar
    $('#lineColor').width(momentOfSong-start);

    //change second of song
    var procent = ((momentOfSong-start)/width);
    newAudio.currentTime = Math.floor(procent*newAudio.duration);
})


//----------------------  Gallery ----------------------

var picture = "";
var $gallery = $('#galleryBox img');

function show(){
    var self = $(this);
    var img = self.attr('data-src');
    // console.log(img)
    // var title = self.attr('alt');
    picture = self;

    $('#modalFoto').attr('src',img);
    // $('#captionFoto').text(title)
    $('#modal').fadeIn(300);
}

function show2(element){
    var img = $(element).attr('data-src');
    // var title = $(element).attr('alt');
    picture = $(element);
    $('#modalFoto').attr('src',img);
    // $('#captionFoto').text(title)
    $('#modal').fadeIn(300);
}

if(!isMobile){
    $('#galleryBox img').click(show);
    $('#carBox img').click(show);
}


$('#prevFoto').on('click', function(){
    var prev = picture.prev();
    if(prev.length == 0){
        prev = $gallery.eq(($gallery.length)-1);
    }
    show2(prev);
})

$('#nextFoto').on('click', function(){
    var next = picture.next();
    if(next.length == 0){
        next = $gallery.eq(0);
    }
    show2(next);
})

$('#closeFoto').on('click', function(){
    $('#modal').fadeOut();
})

$('.back').on('click', function(){
    $(this).parent().fadeOut();
})
