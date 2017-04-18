$(document).ready(function () {

	$('*[data-animate]').addClass('hidee').each(function () {
		$(this).viewportChecker({
			classToAdd: 'showw animated ' + $(this).data('animate'),
			classToRemove: 'hidee',
			offset: '30%'
		});
	});

	$('a').smoothScroll({
		offset: 10,
		speed: 600,


	});

	new jPlayerPlaylist({
		jPlayer: "#jquery_jplayer_1",
		cssSelectorAncestor: "#jp_container_1"
	}, [
		{
			title: "Kochać Cię za późno - z repertuaru Kombi",
			mp3: "audio/Track%2001.mp3",
			oga: "audio/Track%2001.mp3"
		},
		{
			title: "Move in the Right Direction - z repertuaru Gossip",
			mp3: "audio/Track%2030.mp3",
			oga: "audio/Track%2030.mp3"
		},
		{
			title: "Co za noc - z repertuaru Dystans",
			mp3: "audio/Track%2028.mp3",
			oga: "audio/Track%2028.mp3"
		},
		{
			title: "Za daleko mieszkasz miły - z repertuaru A. Rusowicz",
			mp3: "audio/Track%2027.mp3",
			oga: "audio/Track%2027.mp3"
		},
		{
			title: "Ona i on - z repertuaru Weekend",
			mp3: "audio/Track%2003.mp3",
			oga: "audio/Track%2003.mp3"
		},
		{
			title: "Oj Smereko - piosenka ukraińska",
			mp3: "audio/Track%2005.mp3",
			oga: "audio/Track%2005.mp3"
		},
		{
			title: "Statki na niebie - z repertuaru De Mono",
			mp3: "audio/Track%2014.mp3",
			oga: "audio/Track%2014.mp3"
		},
		{
			title: "Tell Me Why - z repertuaru Amna",
			mp3: "audio/Track%2029.mp3",
			oga: "audio/Track%2029.mp3"
		},
		{
			title: "Szukam dziewczyny - z repertuaru Masters",
			mp3: "audio/Track%2009.mp3",
			oga: "audio/Track%2009.mp3"
		},
		{
			title: "Simply the best  - z repertuaru Tiny Turner",
			mp3: "audio/Track%2002.mp3",
			oga: "audio/Track%2002.mp3"
		},
		{
			title: "Jesteś częścią mnie - z repertuaru For Teens",
			mp3: "audio/Track%2019.mp3",
			oga: "audio/Track%2019.mp3"
		},
		{
			title: "Wielka dama - z repertuaru Anny Jantar",
			mp3: "audio/Track%2006.mp3",
			oga: "audio/Track%2006.mp3"
		},
		{
			title: "Prawdziwe powietrze - z repertuaru Loka",
			mp3: "audio/Track%2007.mp3",
			oga: "audio/Track%2007.mp3"
		},

		{
			title: "Touch me - z repertuaru Samanthy Fox",
			mp3: "audio/Track%2008.mp3",
			oga: "audio/Track%2008.mp3"
		},

		{
			title: "Ruchome piaski - z repertuaru Varius Manx",
			mp3: "audio/Track%2004.mp3",
			oga: "audio/Track%2004.mp3"
		},
		{
			title: "Nogi - z repertuaru Czarno Czarni",
			mp3: "audio/Track%2016.mp3",
			oga: "audio/Track%2016.mp3"
		},
		{
			title: "Kolorowe jarmarki - wersja Maryli Rodowicz",
			mp3: "audio/Track%2026.mp3",
			oga: "audio/Track%2026.mp3"
		},
		{
			title: "Zanim wstanie dzień - z repertuaru Adama",
			mp3: "audio/Track%2017.mp3",
			oga: "audio/Track%2017.mp3"
		},
		{
			title:"Trzynastego - z repertuaru Kasi Sobczyk ",
			mp3:"audio/Track%2010.mp3",
			oga:"audio/Track%2010.mp3"
		},
		{
			title: "Promienie - z repertuaru Tarzan Boy",
			mp3: "audio/Track%2020.mp3",
			oga: "audio/Track%2020.mp3"
		},
		{
			title: "Marysiu buzi daj - z repertuaru ludowego",
			mp3: "audio/Track%2015.mp3",
			oga: "audio/Track%2015.mp3"
		},
		{
			title: "Słowo jedyne Ty - z repertuaru Czerwone Gitary ",
			mp3: "audio/Track%2011.mp3",
			oga: "audio/Track%2011.mp3"
		},
		{
			title: "Małgośka - z repertuaru Maryli Rodowicz",
			mp3: "audio/Track%2013.mp3",
			oga: "audio/Track%2013.mp3"
		},
		{
			title: "Na falochronie - z repertuaru Emigranci",
			mp3: "audio/Track%2021.mp3",
			oga: "audio/Track%2021.mp3"
		},
		{
			title: "Weselne dzieci - z repertuaru Maryli Rodowicz ",
			mp3: "audio/Track%2018.mp3",
			oga: "audio/Track%2018.mp3"
		},
		{
			title: "Moja Gitara - z repertuaru Lider",
			mp3: "audio/Track%2012.mp3",
			oga: "audio/Track%2012.mp3"
		},
		{
			title: "Dla zakochanych - z repertuaru De Mono",
			mp3: "audio/Track%2023.mp3",
			oga: "audio/Track%2023.mp3"
		},
		{
			title: "Zabiore Cie - z repertuaru Kancelaria",
			mp3: "audio/Track%2022.mp3",
			oga: "audio/Track%2022.mp3"
		},
		{
			title: "Żono Moja - z repertuaru Darko Damiana",
			mp3: "audio/Track%2024.mp3",
			oga: "audio/Track%2024.mp3"
		},




	], {
		swfPath: "../../dist/jplayer",
		supplied: "oga, mp3",
		wmode: "window",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true
	});
  
  
  //-----------------------nav2----------------------------------//
    $(window).scroll(function(){
    if($(this).scrollTop()>600){
      $('#nav2').show('slow');
    }
    else {
      $('#nav2').hide(1000);
    }
  });
  //-----------------------nav2----------------------------------//


});