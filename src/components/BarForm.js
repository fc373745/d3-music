import React from 'react'
import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'


import './WaveForm.css'

class BarForm extends React.Component{

    width = window.innerWidth
    svgRef = React.createRef()

    componentDidMount(){
        this.createAudio()
    }

    createAudio = () => {
        let array = new Uint8Array(160)

        const node = this.svgRef.current

        let scaleR = scaleLinear()
            .domain([0,255])
            .range([174, 34])

        let scaleG = scaleLinear()
            .domain([0, 255])
            .range([195,51])
        
        let scaleB = scaleLinear()
            .domain([0,255])
            .range([176, 59])

        select(node).selectAll('rect')
            .data(array)
            .enter()
            .append('rect')
            .attr('x', (d,i)=>i*(this.width/array.length))
            .attr('width', this.width/array.length -1 )

        let renderFrame = () =>{
            requestAnimationFrame(renderFrame)
            this.props.analyser.getByteFrequencyData(array)

            select(node).selectAll('rect')
                .data(array)
                .attr('y', d=>280-d)
                .attr('height', d=>d*1.5)
                .attr('fill', d=>{
                    return `rgb(${scaleR(d)},${scaleG(d)},${scaleB(d)})`
                })
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

export default BarForm