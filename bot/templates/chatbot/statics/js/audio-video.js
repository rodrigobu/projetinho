var chat_input = $("#chat_input");

function captureMicrophone(callback) {
    if (microphone) {
        callback(microphone);
        return;
    }
    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        console.log('This browser does not supports WebRTC getUserMedia API.');
        if (!!navigator.getUserMedia) {
            console.log('This browser seems supporting deprecated getUserMedia API.');
        }
    }
    navigator.mediaDevices.getUserMedia({
        audio: isEdge ? true : {
            echoCancellation: false
        }
    }).then(function (mic) {
        callback(mic);
    }).catch(function (error) {
        alert('Não foi possível capturar o áudio do microfone.');
        console.error(error);
    });
}

function createAudioElement(src) {
    let newAudio = document.createElement('audio');
    newAudio.controls = true;
    if (src) {
        newAudio.src = src;
    }

    return newAudio
}

function createInputAudio() {
    /* Apaga o input de texto e cria os elementos de gravação de áudio */

    let divAudio = document.createElement('div');
    let iconAudioRecording = document.createElement('i');
    let btnStopRecording = document.createElement('button');
    let btnSendAudioRecording = document.createElement('button');
    let btnCancelAudioSending = document.createElement('button');

    iconAudioRecording.className = 'fa-microphone fa-blink';
    iconAudioRecording.id = 'blinking-mic-icon';
    btnStopRecording.id = 'stop-recording';
    btnStopRecording.className = 'stop-recording';
    btnStopRecording.innerText = 'Stop';
    btnStopRecording.onclick = function () {
        StopRecording();
        this.classList = 'hidden';
        btnSendAudioRecording.className = 'btn btn-success btn-icon';
        btnCancelAudioSending.className = 'btn btn-icon';
        iconAudioRecording.classList.remove('fa-blink');
    }

    btnSendAudioRecording.id = 'send-audio';
    btnSendAudioRecording.innerText = 'Enviar';
    btnSendAudioRecording.className = "hidden";

    btnCancelAudioSending.innerText = 'Cancelar';
    btnCancelAudioSending.className = 'hidden';
    btnCancelAudioSending.id = 'cancel-audio';
    btnCancelAudioSending.onclick = cancelClick

    divAudio.appendChild(iconAudioRecording);
    divAudio.appendChild(btnStopRecording);
    divAudio.appendChild(btnSendAudioRecording);
    divAudio.appendChild(btnCancelAudioSending);

    chat_input.empty();
    chat_input.append(divAudio);
    let chatlog = $('.js-chat-log');
    chatlog[0].scrollTop = chatlog[0].scrollHeight;
}

function createInputVideo() {
/* Apaga o input de texto e cria os elementos de gravação de vídeo */

    let divVideo = document.createElement('div');
    let iconVideoRecording = document.createElement('i');
    let btnStopVideoRecording = document.createElement('button');
    let btnSendVideoRecording = document.createElement('button');
    let btnCancelVideoSending = document.createElement('button');

    iconVideoRecording.className = 'fa-video-camera fa-blink';
    iconVideoRecording.id = 'blinking-cam-icon';
    btnStopVideoRecording.id = 'stop-video-recording';
    btnStopVideoRecording.className = 'stop-recording';
    btnStopVideoRecording.innerText = 'Stop';
    btnStopVideoRecording.onclick = function () {
        stopVideoRecording();
        this.classList = 'hidden';
        btnSendVideoRecording.className = 'btn btn-success btn-icon';
        btnCancelVideoSending.className = 'btn btn-icon';
        iconVideoRecording.classList.remove('fa-blink');
    }

    btnSendVideoRecording.id = 'send-video';
    btnSendVideoRecording.innerText = 'Enviar';
    btnSendVideoRecording.className = "hidden";

    btnCancelVideoSending.innerText = 'Cancelar';
    btnCancelVideoSending.className = 'hidden';
    btnCancelVideoSending.id = 'cancel-video';
    btnCancelVideoSending.onclick = cancelClick

    divVideo.appendChild(iconVideoRecording);
    divVideo.appendChild(btnStopVideoRecording);
    divVideo.appendChild(btnSendVideoRecording);
    divVideo.appendChild(btnCancelVideoSending);

    chat_input.empty();
    chat_input.append(divVideo);
    let chatlog = $('.js-chat-log');
    chatlog[0].scrollTop = chatlog[0].scrollHeight;



    let video = document.createElement('video');
    video.id = new Date().getTime().toString();
    video.controls = true;
    video.autoplay = true;
    divVideo.appendChild(video);

    return video.id;

}

function stopRecordingCallback() {
    audio = createAudioElement(URL.createObjectURL(recorder.getBlob()));
    createRowUsuario({ media: 'audio', el: audio });
    setTimeout(function () {
        if (!audio.paused) return;
        setTimeout(function () {
            if (!audio.paused) return;
            audio.play();
        }, 1000);

        audio.play();
    }, 300);
    audio.play();

    $('#send-audio').click(function () {
        console.log(recorder.getBlob());
        sendMediaBlob('audio', recorder.getBlob());
    })
}

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var recorder; // globally accessible
var microphone;

function StartRecording() {
    if (!microphone) {
        captureMicrophone(function (mic) {
            microphone = mic;
            if (isSafari) {
                alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
                return;
            }
            StartRecording();
        });
        return;
    }
    // Conseguiu capturar o microfone
    createInputAudio();

    var options = {
        type: 'audio',
        numberOfAudioChannels: isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        bufferSize: 16384
    };

    if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
        options.sampleRate = 48000; // or 44100 or remove this line for default
    }

    if (recorder) {
        recorder.destroy();
        recorder = null;
    }

    recorder = RecordRTC(microphone, options);
    recorder.startRecording();
};

function StopRecording () {
    recorder.stopRecording(stopRecordingCallback);
    ReleaseMicrophone();
};

function ReleaseMicrophone () {
    if (microphone) {
        microphone.stop();
        microphone = null;
    }
};

function DownloadRecording () {
    this.disabled = true;
    if (!recorder || !recorder.getBlob()) return;
    if (isSafari) {
        recorder.getDataURL(function (dataURL) {
            SaveToDisk(dataURL, getFileName('mp3'));
        });
        return;
    }
    var blob = recorder.getBlob();
    var file = new File([blob], getFileName('mp3'), {
        type: 'audio/mp3'
    });
    invokeSaveAsDialog(file);
};

function click(el) {
    el.disabled = false; // make sure that element is not disabled
    var evt = document.createEvent('Event');
    evt.initEvent('click', true, true);
    el.dispatchEvent(evt);
}

function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    return 'AudioBot-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}

function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.download = fileName || 'unknown';
        save.style = 'display:none;opacity:0;color:transparent;';
        (document.body || document.documentElement).appendChild(save);
        if (typeof save.click === 'function') {
            save.click();
        } else {
            save.target = '_blank';
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            save.dispatchEvent(event);
        }
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }
    // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, '_blank');
        _window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}


var videoRecorder;

function captureCameraVideo(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (camera) {
        callback(camera);
    }).catch(function (error) {
        alert('Não foi possível capturar sua câmera. Atualize seu navegador para evitar problemas de compatibilidade.');
        console.error(error);
    });
}

function stopVideoRecording() {
    videoRecorder.stopRecording(stopRecordingVideoCallback);
}

function stopRecordingVideoCallback() {
    let videoBlob = videoRecorder.getBlob();
    window.video.src = video.srcObject = null;
    window.video.src = URL.createObjectURL(videoBlob);
    window.video.play();
    videoRecorder.camera.stop();

    $('#send-video').click(function () {
        console.log(videoBlob);
        sendMediaBlob('video', videoBlob);
    });

    videoRecorder.destroy();
    videoRecorder = null;
}


function startVideoRecording() {

    captureCameraVideo(function (camera) {
        window.video = document.getElementById(createInputVideo());
        setSrcObject(camera, window.video);
        window.video = createRowUsuario({ media: 'video', el: video });
        window.video.play();

        videoRecorder = RecordRTC(camera, {
            type: 'video'
        });

        console.log("videoRecorder: ");
        console.log(videoRecorder);

        videoRecorder.startRecording();

        // release camera on stopRecording
        videoRecorder.camera = camera;
    });
}
