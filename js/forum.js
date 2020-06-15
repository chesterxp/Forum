/*!
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(i, l) {
    if ("IntersectionObserver" in i && "IntersectionObserverEntry" in i && "intersectionRatio" in i.IntersectionObserverEntry.prototype) {
        return
    }
    var b = [];

    function e(p) {
        this.time = p.time;
        this.target = p.target;
        this.rootBounds = p.rootBounds;
        this.boundingClientRect = p.boundingClientRect;
        this.intersectionRect = p.intersectionRect || j();
        this.isIntersecting = !!p.intersectionRect;
        var r = this.boundingClientRect;
        var q = r.width * r.height;
        var o = this.intersectionRect;
        var n = o.width * o.height;
        if (q) {
            this.intersectionRatio = n / q
        } else {
            this.intersectionRatio = this.isIntersecting ? 1 : 0
        }
    }

    function a(p, o) {
        var n = o || {};
        if (typeof p != "function") {
            throw new Error("callback must be a function")
        }
        if (n.root && n.root.nodeType != 1) {
            throw new Error("root must be an Element")
        }
        this._checkForIntersections = m(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);
        this._callback = p;
        this._observationTargets = [];
        this._queuedEntries = [];
        this._rootMarginValues = this._parseRootMargin(n.rootMargin);
        this.thresholds = this._initThresholds(n.threshold);
        this.root = n.root || null;
        this.rootMargin = this._rootMarginValues.map(function(q) {
            return q.value + q.unit
        }).join(" ")
    }
    a.prototype.THROTTLE_TIMEOUT = 100;
    a.prototype.POLL_INTERVAL = null;
    a.prototype.observe = function(n) {
        if (this._observationTargets.some(function(o) {
                return o.element == n
            })) {
            return
        }
        if (!(n && n.nodeType == 1)) {
            throw new Error("target must be an Element")
        }
        this._registerInstance();
        this._observationTargets.push({
            element: n,
            entry: null
        });
        this._monitorIntersections()
    };
    a.prototype.unobserve = function(n) {
        this._observationTargets = this._observationTargets.filter(function(o) {
            return o.element != n
        });
        if (!this._observationTargets.length) {
            this._unmonitorIntersections();
            this._unregisterInstance()
        }
    };
    a.prototype.disconnect = function() {
        this._observationTargets = [];
        this._unmonitorIntersections();
        this._unregisterInstance()
    };
    a.prototype.takeRecords = function() {
        var n = this._queuedEntries.slice();
        this._queuedEntries = [];
        return n
    };
    a.prototype._initThresholds = function(o) {
        var n = o || [0];
        if (!Array.isArray(n)) {
            n = [n]
        }
        return n.sort().filter(function(r, q, p) {
            if (typeof r != "number" || isNaN(r) || r < 0 || r > 1) {
                throw new Error("threshold must be a number between 0 and 1 inclusively")
            }
            return r !== p[q - 1]
        })
    };
    a.prototype._parseRootMargin = function(n) {
        var o = n || "0px";
        var p = o.split(/\s+/).map(function(q) {
            var r = /^(-?\d*\.?\d+)(px|%)$/.exec(q);
            if (!r) {
                throw new Error("rootMargin must be specified in pixels or percent")
            }
            return {
                value: parseFloat(r[1]),
                unit: r[2]
            }
        });
        p[1] = p[1] || p[0];
        p[2] = p[2] || p[0];
        p[3] = p[3] || p[1];
        return p
    };
    a.prototype._monitorIntersections = function() {
        if (!this._monitoringIntersections) {
            this._monitoringIntersections = true;
            this._checkForIntersections();
            if (this.POLL_INTERVAL) {
                this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL)
            } else {
                f(i, "resize", this._checkForIntersections, true);
                f(l, "scroll", this._checkForIntersections, true);
                if ("MutationObserver" in i) {
                    this._domObserver = new MutationObserver(this._checkForIntersections);
                    this._domObserver.observe(l, {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true
                    })
                }
            }
        }
    };
    a.prototype._unmonitorIntersections = function() {
        if (this._monitoringIntersections) {
            this._monitoringIntersections = false;
            clearInterval(this._monitoringInterval);
            this._monitoringInterval = null;
            k(i, "resize", this._checkForIntersections, true);
            k(l, "scroll", this._checkForIntersections, true);
            if (this._domObserver) {
                this._domObserver.disconnect();
                this._domObserver = null
            }
        }
    };
    a.prototype._checkForIntersections = function() {
        var o = this._rootIsInDom();
        var n = o ? this._getRootRect() : j();
        this._observationTargets.forEach(function(s) {
            var v = s.element;
            var u = d(v);
            var q = this._rootContainsTarget(v);
            var r = s.entry;
            var p = o && q && this._computeTargetAndRootIntersection(v, n);
            var t = s.entry = new e({
                time: c(),
                target: v,
                boundingClientRect: u,
                rootBounds: n,
                intersectionRect: p
            });
            if (!r) {
                this._queuedEntries.push(t)
            } else {
                if (o && q) {
                    if (this._hasCrossedThreshold(r, t)) {
                        this._queuedEntries.push(t)
                    }
                } else {
                    if (r && r.isIntersecting) {
                        this._queuedEntries.push(t)
                    }
                }
            }
        }, this);
        if (this._queuedEntries.length) {
            this._callback(this.takeRecords(), this)
        }
    };
    a.prototype._computeTargetAndRootIntersection = function(t, p) {
        if (i.getComputedStyle(t).display == "none") {
            return
        }
        var s = d(t);
        var o = s;
        var r = t.parentNode;
        var q = false;
        while (!q) {
            var n = null;
            if (r == this.root || r.nodeType != 1) {
                q = true;
                n = p
            } else {
                if (i.getComputedStyle(r).overflow != "visible") {
                    n = d(r)
                }
            }
            if (n) {
                o = g(n, o);
                if (!o) {
                    break
                }
            }
            r = r.parentNode
        }
        return o
    };
    a.prototype._getRootRect = function() {
        var o;
        if (this.root) {
            o = d(this.root)
        } else {
            var p = l.documentElement;
            var n = l.body;
            o = {
                top: 0,
                left: 0,
                right: p.clientWidth || n.clientWidth,
                width: p.clientWidth || n.clientWidth,
                bottom: p.clientHeight || n.clientHeight,
                height: p.clientHeight || n.clientHeight
            }
        }
        return this._expandRectByRootMargin(o)
    };
    a.prototype._expandRectByRootMargin = function(o) {
        var p = this._rootMarginValues.map(function(r, q) {
            return r.unit == "px" ? r.value : r.value * (q % 2 ? o.width : o.height) / 100
        });
        var n = {
            top: o.top - p[0],
            right: o.right + p[1],
            bottom: o.bottom + p[2],
            left: o.left - p[3]
        };
        n.width = n.right - n.left;
        n.height = n.bottom - n.top;
        return n
    };
    a.prototype._hasCrossedThreshold = function(p, s) {
        var o = p && p.isIntersecting ? p.intersectionRatio || 0 : -1;
        var r = s.isIntersecting ? s.intersectionRatio || 0 : -1;
        if (o === r) {
            return
        }
        for (var q = 0; q < this.thresholds.length; q++) {
            var n = this.thresholds[q];
            if (n == o || n == r || n < o !== n < r) {
                return true
            }
        }
    };
    a.prototype._rootIsInDom = function() {
        return !this.root || h(l, this.root)
    };
    a.prototype._rootContainsTarget = function(n) {
        return h(this.root || l, n)
    };
    a.prototype._registerInstance = function() {
        if (b.indexOf(this) < 0) {
            b.push(this)
        }
    };
    a.prototype._unregisterInstance = function() {
        var n = b.indexOf(this);
        if (n != -1) {
            b.splice(n, 1)
        }
    };

    function c() {
        return i.performance && performance.now && performance.now()
    }

    function m(n, o) {
        var p = null;
        return function() {
            if (!p) {
                p = setTimeout(function() {
                    n();
                    p = null
                }, o)
            }
        }
    }

    function f(p, o, n, q) {
        if (typeof p.addEventListener == "function") {
            p.addEventListener(o, n, q || false)
        } else {
            if (typeof p.attachEvent == "function") {
                p.attachEvent("on" + o, n)
            }
        }
    }

    function k(p, o, n, q) {
        if (typeof p.removeEventListener == "function") {
            p.removeEventListener(o, n, q || false)
        } else {
            if (typeof p.detatchEvent == "function") {
                p.detatchEvent("on" + o, n)
            }
        }
    }

    function g(q, o) {
        var u = Math.max(q.top, o.top);
        var p = Math.min(q.bottom, o.bottom);
        var t = Math.max(q.left, o.left);
        var r = Math.min(q.right, o.right);
        var s = r - t;
        var n = p - u;
        return (s >= 0 && n >= 0) && {
            top: u,
            bottom: p,
            left: t,
            right: r,
            width: s,
            height: n
        }
    }

    function d(n) {
        var o = n.getBoundingClientRect();
        if (!o) {
            return
        }
        if (!o.width || !o.height) {
            o = {
                top: o.top,
                right: o.right,
                bottom: o.bottom,
                left: o.left,
                width: o.right - o.left,
                height: o.bottom - o.top
            }
        }
        return o
    }

    function j() {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0
        }
    }

    function h(n, p) {
        var o = p;
        while (o) {
            if (o.nodeType == 11 && o.host) {
                o = o.host
            }
            if (o == n) {
                return true
            }
            o = o.parentNode
        }
        return false
    }
    i.IntersectionObserver = a;
    i.IntersectionObserverEntry = e
}(window, document));

var forum = {
    isMobile: '',
    init: function() {
        this.isMobile = this.checkDevice();
        this.animateAllLinks();
        // this.audioPlayer();
        this.turnOnLazyLoadObservers();
        this.mainSlider.init();

        if (this.isMobile) {
            this.hamburgerButton();
            this.mobileGallery('#galleryBox');
            this.mobileGallery('#carBox');
        } else {
            this.main_gallery.init();
        }

        this.audioPlayer();
        this.addBackground.init(this.isMobile);
    },
    addBackground: {
        init: function(isMobile){
            if (isMobile){
                return false;
            }

            const nav = document.querySelector('#nav');
            const self = forum.addBackground;
    
            setInterval(self.checkposition, 500, nav);
        },
        checkposition: function(nav){
            const currentScroll = window.scrollY;
            const self = forum.addBackground;

            if(currentScroll > 300){
                self.toggleClassForNavigation(nav, 'add');
            } else{
                self.toggleClassForNavigation(nav, 'remove');
            }
        },
        toggleClassForNavigation(nav, change){
            nav.classList[change]('backgroundOn');
        }

    },
    
    checkDevice: function() {
        let windowWidth = document.body.clientWidth;
        if (windowWidth < 801) {
            return true;
        }
    },
    hamburgerButton: function() {
        var nav = document.querySelector('#nav');
        const buttons = document.querySelectorAll('.navBox a, .hamburger-menu');

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                nav.classList.toggle('showNavBox');
            });
        });
    },
    animateAllLinks: function() {
        var all = document.querySelectorAll('a[href^="#"]');
        all.forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                var href = this.getAttribute('href');
                var destination = document.querySelector(href).offsetTop - 50;
                var currentPosition = window.pageYOffset;
                var body = document.querySelector('body,html');
                forum.animate(body, "scrollTop", "", currentPosition, destination, 600, true);
            });
        })
    },
    animate: function(elem, style, unit, from, to, time, prop) {
        if (!elem) return;
        var start = new Date().getTime(),
            timer = setInterval(function() {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from)) + unit;
                } else {
                    elem.style[style] = (from + step * (to - from)) + unit;
                }
                if (step == 1) clearInterval(timer);
            }, 25);
        elem.style[style] = from + unit;
    },
    main_gallery: {
        modal: '',
        modalFoto: '',
        closeFoto: '',
        imgsGalleryBox: '',
        move_photo: '',
        picture_from_gallery: "",
        init: function() {
            var self = forum.main_gallery;
            self.modal = document.querySelector('#modal');
            self.modalFoto = document.querySelector('#modalFoto');
            self.closeFoto = document.querySelectorAll('#closeFoto, .back');
            self.imgsGalleryBox = document.querySelectorAll('#galleryBox img, #carBox img');
            self.move_photo = document.querySelectorAll('.move_photo');

            self.imgsGalleryBox.forEach(function(img) {
                img.addEventListener('click', self.showPicture);
            })
            self.move_photo.forEach(function(dir) {
                dir.addEventListener('click', self.change_picture);
            })
            self.closeFoto.forEach(function(close) {
                close.addEventListener('click', function() {
                    self.modal.classList.remove('show_modal');
                })
            })
        },
        showPicture: function() {
            var self = forum.main_gallery;
            self.picture_from_gallery = this;
            var img_src = self.picture_from_gallery.getAttribute('data-src-big');
            self.modal.classList.add('show_modal');
            self.modalFoto.src = img_src;
        },
        change_picture: function() {
            var direction = this.getAttribute('data-src-direction');
            var new_img;
            var self = forum.main_gallery;
            var main_picture = self.picture_from_gallery;
            if (direction == "left") {
                if (main_picture) {
                    new_img = main_picture.previousElementSibling
                } else {
                    new_img = self.imgsGalleryBox[self.imgsGalleryBox.length - 1];
                }
            } else if (direction == "right") {
                if (main_picture) {
                    new_img = main_picture.nextElementSibling;
                } else {
                    new_img = self.imgsGalleryBox[0];
                }

            }
            self.picture_from_gallery = new_img;
            self.modalFoto.src = new_img.getAttribute('data-src-big');
        }
    },
    mainSlider: {
        images: "",
        currentPhoto: 1,
        sliderMainFoto: '',
        init: function() {
            var me = forum.mainSlider;
            me.sliderMainFoto = document.querySelector('.sliderMainFoto');
            me.showPhoto(me.currentPhoto);
            me.add_event_click();
        },
        add_event_click: function() {
            var arrows = document.querySelectorAll('.arrow_move');
            arrows.forEach(function(arrow) {
                arrow.addEventListener('click', forum.mainSlider.change_photo);
            })
        },
        change_photo: function(e) {
            var me = forum.mainSlider;
            var direction = e.target.dataset.move;
            var current = me.currentPhoto;
            var last = 5;
            if (direction == "right") {
                current == last ? current = 1 : current++;
            } else if (direction == "left") {
                current == 1 ? current = last : current--;
            }
            me.currentPhoto = current;
            me.showPhoto(current);
        },
        showPhoto: function(number) {
            forum.mainSlider.sliderMainFoto.style.background = "url('../img/slider/slider" + number + ".jpg')";
        }
    },
    turnOnLazyLoadObservers: function() {
        var allImages = document.querySelectorAll("img[data-src],source[data-srcset]");
        var fadeInPhotoMainGallery = document.querySelector('#galleryBox');
        var fadeInPhotoCarGallery = document.querySelector('#car');
        var animateSections = document.querySelectorAll('.animate-section');

        forum.myObserver(allImages, forum.load, false);
        forum.myObserver(fadeInPhotoMainGallery, forum.fadeInGalleryElement.bind(this, 'main'), false);
        forum.myObserver(fadeInPhotoCarGallery, forum.fadeInGalleryElement.bind(this, 'car'), false);
        forum.myObserver(animateSections, forum.showSection, false);
    },
    fadeInGalleryElement: function(typeOfGallery) {
        let target = '';
        if (typeOfGallery === 'main') {
            target = '#galleryBox img';
        } else if (typeOfGallery === 'car') {
            target = '#carBox .gallery_photo';
        }
        document.querySelectorAll(target).forEach(function(img, i) {
            setTimeout(function() {
                img.classList.add('show_gallery_box__photo');
            }, 150 * i);

        })
    },
    showSection: function(element) {
        element.style.opacity = 1;
    },
    myObserver: function(targets, viewPortIn, viewPortOut, rootMargin = '1px') {
        var target = Array.from(targets);
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.intersectionRatio > 0) {
                    viewPortIn(entry.target);
                    if (viewPortOut == false) {
                        observer.unobserve(entry.target);
                    }
                } else {
                    if (viewPortOut != false) {
                        viewPortOut();
                    }
                    return true;
                }
            });
        }, {
            rootMargin: rootMargin,
            threshold: 0.01
        });
        if (target.length > 1) {
            target.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            observer.observe(targets)
        }
    },
    load: function(el) {
        if (el.getAttribute('data-src')) {
            el.src = el.getAttribute('data-src');
        }
    },
    mobileGallery: function(target) {
        const C = document.querySelector(target); //container
        const N = C.children.length; //number of picture
        let i = 0; //current picture
        let x0 = null;
        let locked = false;

        C.style.setProperty('--n', N);

        C.addEventListener('mousedown', lock, false);
        C.addEventListener('touchstart', lock, false);

        C.addEventListener('mousemove', drag, false);
        C.addEventListener('touchmove', drag, false);

        C.addEventListener('mouseup', move, false);
        C.addEventListener('touchend', move, false);

        function unify(e) {
            return e.changedTouches ? e.changedTouches[0] : e;
        };

        function lock(e) {
            // const self = forum.mobileGallery;
            x0 = unify(e).clientX;
            C.classList.toggle('smooth', !(locked = true))
        };

        function drag(e) {
            // const self = forum.mobileGallery;
            e.preventDefault();
            if (locked)
                C.style.setProperty('--tx', `${Math.round(unify(e).clientX - x0)}px`)
        };

        function move(e) {
            // const self = forum.mobileGallery;
            if (locked) {
                let dx = unify(e).clientX - x0,
                    s = Math.sign(dx);

                if ((i > 0 || s < 0) && (i < N - 1 || s > 0))
                    C.style.setProperty('--i', i -= s);
                C.style.setProperty('--tx', '0px');
                C.classList.toggle('smooth', !(locked = false));
                x0 = null
            }
        }
    },
    audioPlayer: function(){
        const trackList = [
            {
                artist: 'z repertuaru Kombi',
                titleOfSong: 'Kochać Cię za późno',
                src: '/audio/Track-01.mp3',
                fullTime: '04:21'
            },
            {
                artist: 'z repertuaru Gossip',
                titleOfSong: 'Move in the Right Direction',
                src: '/audio/Track-30.mp3',
                fullTime: '03:17'
            },
            {
                artist: 'z repertuaru Dystans',
                titleOfSong: 'Co za noc',
                src: '/audio/Track-28.mp3',
                fullTime: '03:18'
            },
            {
                artist: 'z repertuaru A. Rusowicz',
                titleOfSong: 'Za daleko mieszkasz miły',
                src: '/audio/Track-27.mp3',
                fullTime: '02:33'
            },
            {
                artist: 'z repertuaru Weekend',
                titleOfSong: 'Ona i on',
                src: '/audio/Track-03.mp3',
                fullTime: '04:33'
            },
            {
                artist: 'piosenka ukraińska',
                titleOfSong: 'Oj Smereko',
                src: '/audio/Track-25.mp3',
                fullTime: '03:22'
            },
            {
                artist: 'z repertuaru De Mono',
                titleOfSong: 'Statki na niebie',
                src: '/audio/Track-14.mp3',
                fullTime: '03:43'
            },
            {
                artist: 'z repertuaru Amna',
                titleOfSong: 'Tell Me Why',
                src: '/audio/Track-29.mp3',
                fullTime: 'Tell Me Why'
            },
            {
                artist: 'z repertuaru Masters',
                titleOfSong: 'Szukam dziewczyny',
                src: '/audio/Track-09.mp3',
                fullTime: '03:29'
            },
            {
                artist: 'repertuaru Tiny Turner',
                titleOfSong: 'Simply the best',
                src: '/audio/Track-02.mp3',
                fullTime: '04:02'
            },
            {
                artist: 'repertuaru For Teens',
                titleOfSong: 'Jesteś częścią mnie',
                src: '/audio/Track-19.mp3',
                fullTime: '03:48'
            },
            {
                artist: 'z repertuaru Anny Jantar',
                titleOfSong: 'Wielka dama',
                src: '/audio/Track-06.mp3',
                fullTime: '03:51'
            },
            {
                artist: 'z repertuaru Loka',
                titleOfSong: 'Prawdziwe powietrze',
                src: '/audio/Track-07.mp3',
                fullTime: '02:57'
            },
            {
                artist: 'z repertuaru Samanthy Fox',
                titleOfSong: 'Touch me',
                src: '/audio/Track-08.mp3',
                fullTime: '03:41'
            },
            {
                artist: 'z repertuaru Varius Manx',
                titleOfSong: 'Ruchome piaski',
                src: '/audio/Track-04.mp3',
                fullTime: '04:42'
            },
            {
                artist: 'z repertuaru Czarno Czarni',
                titleOfSong: 'Nogi',
                src: '/audio/Track-16.mp3',
                fullTime: '03:00'
            },
            {
                artist: 'wersja Maryli Rodowicz',
                titleOfSong: 'Kolorowe jarmarki',
                src: '/audio/Track-26.mp3',
                fullTime: '04:09'
            },
            {
                artist: 'z repertuaru Adama',
                titleOfSong: 'Zanim wstanie dzień',
                src: '/audio/Track-17.mp3',
                fullTime: '04:14'
            },
            {
                artist: 'z repertuaru Kasi Sobczyk',
                titleOfSong: 'Trzynastego',
                src: '/audio/Track-10.mp3',
                fullTime: '03:19'
            },
            {
                artist: 'z repertuaru Tarzan Boy',
                titleOfSong: 'Promienie',
                src: '/audio/Track-20.mp3',
                fullTime: '04:13'
            },
            {
                artist: 'z repertuaru ludowego',
                titleOfSong: 'Marysiu buzi daj',
                src: '/audio/Track-15.mp3',
                fullTime: '03:25'
            },
            {
                artist: 'z repertuaru Czerwone Gitary',
                titleOfSong: 'Słowo jedyne Ty',
                src: '/audio/Track-11.mp3',
                fullTime: '02:47'
            },
            {
                artist: 'z repertuaru Maryli Rodowicz',
                titleOfSong: 'Małgośka',
                src: '/audio/Track-13.mp3',
                fullTime: '02:59'
            },
            {
                artist: 'z repertuaru Emigranci',
                titleOfSong: 'Na falochronie',
                src: '/audio/Track-21.mp3',
                fullTime: '04:27'
            },
            {
                artist: 'z repertuaru Maryli Rodowicz',
                titleOfSong: 'Weselne dzieci',
                src: '/audio/Track-18.mp3',
                fullTime: 'Weselne dzieci'
            },
            {
                artist: 'z repertuaru Lider',
                titleOfSong: 'Moja Gitara',
                src: '/audio/Track-12.mp3',
                fullTime: '04:25'
            },
            {
                artist: 'z repertuaru De Mono',
                titleOfSong: 'Dla zakochanych',
                src: '/audio/Track-23.mp3',
                fullTime: '04:08'
            },
            {
                artist: 'z repertuaru Kancelaria',
                titleOfSong: 'Zabiore Cie',
                src: '/audio/Track-22.mp3',
                fullTime: '05:21'
            },
            {
                artist: 'z repertuaru Darko Damiana',
                titleOfSong: 'Żono Moja',
                src: '/audio/Track-24.mp3',
                fullTime: '03:51'
            }
        ];
        let currentAudio = 0;
        let myAudio = document.createElement('audio');
        let playerPhotoBox;
        let playerTitleBox;
        let actualDurationTimeBox;
        let fullTimeOfSongBox;
        let durationLineBox;
        let durtionLine; 
        let listOfSongsBox;
        let songsFromTheList;
        let playerInitialization = true;
        let body;

        function init(){
            const play = document.querySelector('#play');
            const pause = document.querySelector('#pause');
            const next = document.querySelector('#next');
            const prev = document.querySelector('#prev');
            const trackListLength = trackList.length;
            const showListButtonMobile = document.querySelector('#playListButton');

            body = document.querySelector('body');
            listOfSongsBox = document.querySelector('#playlist');
            songsFromTheList = listOfSongsBox.querySelectorAll('.song');
            actualDurationTimeBox = document.querySelector('#duration');
            fullTimeOfSongBox = document.querySelector('#fullTime');
            durationLineBox = document.querySelector('.lineColorBox');
            durtionLine = document.querySelector('.lineColor');
            playerPhotoBox = document.querySelector('#songFoto');
            playerTitleBox = document.querySelector('.titleBox .title');

            setActualSong(currentAudio);
            turnOnSong();

            //basic buttons
            play.addEventListener('click', ()=>{
                myAudio.play();
            })
            pause.addEventListener('click', ()=>{
                myAudio.pause();
            })
            next.addEventListener('click', ()=>{
                changeNamberOfSong('next',trackListLength);
                turnOnSong();
            })
            prev.addEventListener('click', ()=>{
                changeNamberOfSong('prev',trackListLength);
                turnOnSong();
            })

            //additional functions
            addMoveSongEvent();
            addEventForSelectSong();
            playNextSong(trackListLength);

            showListButtonMobile.addEventListener('click', showlistOfSongs)
            
        };
        //set default song
        function setActualSong(number){
            currentAudio = number;

            if (myAudio.canPlayType('audio/mp3')) {
                myAudio.setAttribute('src',trackList[number].src);
            }
        }
        //change song
        function changeNamberOfSong(type, lengthOfList){
            if(type === 'next'){
                currentAudio += 1;
            } else{
                currentAudio -= 1;
            }

            if(currentAudio === lengthOfList){
                currentAudio = 0;
            } else if(currentAudio === -1){
                currentAudio = lengthOfList-1;
            }
            if (myAudio.canPlayType('audio/mp3')) {
                myAudio.setAttribute('src',trackList[(currentAudio)].src);
            }
        }
        //turn on all mechanism
        function turnOnSong(){
            changeTimeOfSong();
            getFullTimeOfSong();
            changePlayerPhoto();
            changePlayerTitle();
            changeClassOfSongAtList();

            if(!playerInitialization){
                myAudio.play();
            }
            playerInitialization = false;
        }
        function changeTimeOfSong(){
            myAudio.addEventListener("timeupdate", function() {
                var currentTime = myAudio.currentTime;
                var durationTime = myAudio.duration;
                var minutes = '00';
                var second = '00';
                var time = parseInt(currentTime/60, 0);
                var reszta = parseInt(currentTime % 60, 0);
                const currentSongTime = parseInt(((currentTime / durationTime) * 100), 10);
            
                if(currentTime < 60){
                    minutes = '00';
                    if(currentTime < 10){
                        second = '0' + parseInt(currentTime, 0);
                    } else{
                        second = parseInt(currentTime, 0);
                    }
                } else{
                    if(time < 10){
                        minutes = '0' + time;
                        if(reszta < 10){
                            second = '0' + reszta;
                        } else{
                            second = reszta;
                        }
                    } else{
                        minutes = 'time';
                    }
                }

                actualDurationTimeBox.innerHTML = minutes + ':' + second;
                durtionLine.style.width = currentSongTime + "%";
            });
        }
        function getFullTimeOfSong(){
            fullTimeOfSongBox.innerHTML = trackList[currentAudio].fullTime;
        }
        function changePlayerPhoto(){
            const number = randomNumber(39)
            playerPhotoBox.style.backgroundImage = `url('./img/small/foto${number}.jpg')`;
        }
        function randomNumber(max){
            return Math.floor(Math.random() * max);
        }
        function changePlayerTitle(){
            playerTitleBox.innerText = trackList[currentAudio].titleOfSong;
        }
        function changeClassOfSongAtList(){
            for(let i = 0;i < songsFromTheList.length; i++){
                songsFromTheList[i].classList.remove('active');
            }
            songsFromTheList[currentAudio].classList.add('active');
        }
        //additional functions
        function addMoveSongEvent(){
            durationLineBox.addEventListener('click', moveTrack.bind(this));
        }
        function moveTrack(e){
            var widthOfBox = durationLineBox.offsetWidth;
            var procent = (e.offsetX/widthOfBox);

            durtionLine.style.width = e.offsetX + 'px';
            myAudio.currentTime = myAudio.duration * procent;
        }
        function addEventForSelectSong(){
            for(let i = 0; i < songsFromTheList.length; i++){
                songsFromTheList[i].addEventListener('click', selectSong.bind(this));
            }  
        }
        function selectSong(e){
            if(e.target.classList[0] == 'song'){
                const numberOfSong = e.target.dataset.song - 1;
                // changeNamberOfSong(numberOfSong);
                setActualSong(numberOfSong);
                turnOnSong();
                if(forum.isMobile){
                    body.classList.remove('showPlayList')
                }
            }
        }
        function playNextSong(trackListLength){
            myAudio.onended = function(){
                changeNamberOfSong('next',trackListLength);
                turnOnSong();
            }
        }
        function showlistOfSongs(list){
            body.classList.toggle('showPlayList')
        }
        init();
    }
}

forum.init();