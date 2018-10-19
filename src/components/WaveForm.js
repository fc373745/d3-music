import React from 'react'
import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'

import './WaveForm.css'

class WaveForm extends React.Component{

    width = window.innerWidth
    svgRef = React.createRef()

    componentDidMount(){
        this.createAudio()
    }

    createAudio = () => {
        let subsample = (data) => {
            let subsampleData = new Float32Array(800)
            for( let i=0; i<800; i++){
                subsampleData[i] = data[Math.floor(i / 800 * data.length)]
            }
            return subsampleData
        }

        let array = new Float32Array(512)

        const node = this.svgRef.current

        let xScale = scaleLinear()
            .domain([0,700])
            .range([0, this.width])
        
        let yScale = scaleLinear()
            .domain([-1, 1])
            .range([560, 0])
        
        let musicline = line()
            .x((d,i)=>xScale(i))
            .y((d)=>yScale(d))
     
        select(node).append('path')
            .data([array])
            .attr('d', musicline)
            .attr('class', 'line')

        let renderFrame = () =>{
            requestAnimationFrame(renderFrame)
            this.props.analyser.getFloatTimeDomainData(array)
            select(node).select('path')
                .datum(subsample(array))
                .attr('d', musicline)
        }
        renderFrame()
    }

    render(){
        return (
            <div>
                <svg ref={this.svgRef} width={this.width} height="400px"></svg>
            </div>
        )
    }
}

export default WaveForm