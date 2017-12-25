import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';


function ChocolateSquare({center, squareWidth, squareHeight, nbSteps, totalStepLength, stepFun}){
    const stepLength = totalStepLength/nbSteps;

    const steps = stepFun(nbSteps);

    return React.createElement(
        'g', 
        {className: 'chocolate-square'},
        steps.map((step, i) => {
            const greyShade = step*255;
            const w = squareWidth - (i)*(totalStepLength)/nbSteps;
            const h = squareHeight - (i)*(totalStepLength)/nbSteps;

            const x = center.x - w/2;
            const y = center.y - h/2;

            return React.createElement('rect', {  
                key: i,
                x, y,
                width: w,
                height: h,
                fill: `rgb(${greyShade}, ${greyShade}, ${greyShade})`
            })
        })

    );
}


function ChocolateSVG({squareWidth, squareHeight, nbWidth, nbHeight, nbSteps, totalStepLength, stepFun}){
    const squares = [];

    Array(nbWidth).fill().forEach((_, i) => {
        Array(nbHeight).fill().forEach((_, j) => {
            const center = {
                x: i*squareWidth + squareWidth/2,
                y: j*squareHeight + squareHeight/2
            }

            squares.push(React.createElement(ChocolateSquare, {
                key: `${i}-${j}`, 
                center, 
                squareWidth, squareHeight, 
                nbSteps, 
                totalStepLength, 
                stepFun
            }))
        })
    });
    
    return React.createElement(
        'svg', 
        {xmlns: "http://www.w3.org/2000/svg", version: "1.1", width: squareWidth*nbWidth + 1, height: squareHeight*nbHeight+1}, 
        React.createElement('rect', {x: 0, y: 0, width: squareWidth*nbWidth, height: squareHeight*nbHeight}),
        squares,

        React.createElement('rect', {x: 0, y: 0, width: squareWidth*nbWidth, height: squareHeight*nbHeight, fill: 'transparent', stroke: 'red', stokeWidth: 1})
    );
}

function createFile(opts){
    // console.log(`<!doctype html>
    
    console.log(`<?xml version="1.0" encoding="UTF-8"?>
    ${renderToStaticMarkup(React.createElement(ChocolateSVG, opts))}`)
}

const SQUARE_SIZE_UNIT = 40;

const opts = {
    squareWidth: 3*SQUARE_SIZE_UNIT, 
    squareHeight: 2*SQUARE_SIZE_UNIT, 
    nbWidth: 2, 
    nbHeight: 2, 
    nbSteps: 10, 
    totalStepLength: SQUARE_SIZE_UNIT*0.5, 
    stepFun(nb){
        const max = (nb-1)*(nb-1);
        //return Array(nb).fill().map((e, i) => i*i/max);
        return Array(nb).fill().map((e, i) => i/nb);
    }
}

createFile(opts)