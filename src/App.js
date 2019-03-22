import { library } from "@fortawesome/fontawesome-svg-core";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import "./App.css";
import BarForm from "./components/BarForm";
import WaveForm from "./components/WaveForm";

library.add(faPlay, faPause);

const musiclist2 = [
    {
        artist: "Sam Smith",
        name: "Baby, You make me Crazy",
        song: "samsmith.mp3"
    },
    {
        artist: "Mark Morrison",
        name: "Return of the Mack",
        song: "return.mp3"
    },
    {
        artist: "Anna Kendrick",
        name: "Cups (jellosea)",
        song: "anna.mp3"
    },
    {
        artist: "Fleetwood Mac",
        name: "Dreams",
        song: "dreams.mp3"
    },
    {
        artist: "Filter",
        name: "Take a Picture",
        song: "takeapic.mp3"
    }
];

const musicList = [
    "samsmith.mp3",
    "return.mp3",
    "anna.mp3",
    "dreams.mp3",
    "takeapic.mp3"
];

class App extends Component {
    audioRef = React.createRef();
    progress = React.createRef();
    svgRef = React.createRef();
    volume = React.createRef();
    width = window.innerWidth;

    state = {
        form: true,
        BarForm: null,
        WaveForm: null,
        x: 0,
        volumeX: 0,
        song: musiclist2[0].song,
        isPlaying: false,
        audioSet: false
    };

    componentDidMount() {
        setInterval(() => {
            this.setTime();
        }, 500);
    }

    initializeAudio = () => {
        let context = new AudioContext();
        let analyser = context.createAnalyser();
        let audioSrc = context.createMediaElementSource(this.audioRef.current);
        audioSrc.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 512;

        this.setState({
            BarForm: <BarForm analyser={analyser} />,
            WaveForm: <WaveForm analyser={analyser} />
        });
    };

    setVolumeX = e => {
        this.audioRef.current.volume =
            (e.clientX - this.volume.current.getBoundingClientRect().x) / 200;
        this.setState({
            volumeX: e.clientX - this.volume.current.getBoundingClientRect().x
        });
    };

    initializeVolume = () => {
        this.audioRef.current.volume = 0.5;
        this.setState({ volumeX: 100 });
    };

    setX = e => {
        this.audioRef.current.currentTime =
            ((e.clientX - this.progress.current.getBoundingClientRect().x) /
                800) *
            this.audioRef.current.duration;
        this.setState({
            x: e.clientX - this.progress.current.getBoundingClientRect().x
        });
    };

    setSong = song => {
        if (!this.state.audioSet) {
            this.initializeAudio();
            this.initializeVolume();
            this.setState({ audioSet: true });
        }
        this.setState({ song }, () => {
            this.audioRef.current.play();
        });
    };

    setTime = () => {
        let progressTime =
            (this.audioRef.current.currentTime /
                this.audioRef.current.duration) *
            800;
        this.setState({ x: progressTime });
    };

    play = () => {
        if (!this.state.audioSet) {
            this.initializeAudio();
            this.initializeVolume();
            this.setState({ audioSet: true });
        }
        if (!this.state.song) {
            this.setSong(musiclist2[0].song);
        }
        this.setState({ isPlaying: true });
        this.audioRef.current.play();
    };

    pause = () => {
        this.setState({ isPlaying: false });
        this.audioRef.current.pause();
    };

    toggleType = () => {
        this.setState(p => ({ form: !p.form }));
    };

    render() {
        let visualType = null;
        if (this.state.form) {
            visualType = this.state.BarForm;
        } else {
            visualType = this.state.WaveForm;
        }
        const progressWidth = {
            width: `${this.state.x}px`
        };
        const volumeWidth = {
            width: `${this.state.volumeX}px`
        };
        return (
            <div>
                {!this.state.audioSet && <div style={{ height: "400px" }} />}
                <audio
                    ref={this.audioRef}
                    id="audioElement"
                    src={this.state.song}
                />
                <div>
                    {visualType}
                    <div className="media_controls">
                        <FontAwesomeIcon
                            onClick={this.play}
                            icon="play"
                            className="play_button"
                        />
                        <FontAwesomeIcon
                            onClick={this.pause}
                            icon="pause"
                            className="play_button"
                        />
                        <div className="toggle" onClick={this.toggleType}>
                            {this.state.form ? "Oscilloscope" : "Frequency"}
                        </div>
                    </div>
                    <div
                        className="progressbar"
                        onClick={this.setX}
                        ref={this.progress}
                    >
                        <div className="progresstrack" style={progressWidth} />
                    </div>
                    <div
                        className="volumebar"
                        onClick={this.setVolumeX}
                        ref={this.volume}
                    >
                        <div className="volumebartrack" style={volumeWidth} />
                    </div>
                    <div className="music_listing">
                        {musiclist2.map(song => (
                            <div
                                className={
                                    this.state.song === song.song
                                        ? "song_listing_selected"
                                        : "song_listing"
                                }
                                key={song.song}
                                onClick={() => this.setSong(song.song)}
                            >
                                {song.artist} - {song.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
