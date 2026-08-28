/**
 * Numbers of decimal digits to round to
 */
const scale = 2;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }

    // Old formula
    /*
    let score = (100 / Math.sqrt((rank - 1) / 50 + 0.444444) - 50) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    */
    // New formula
		let score = 0;
        if(56<=rank && rank<=150){
			score=1.039035131 * ((185.7 * Math.exp(-0.02715 * rank)) + 14.84)
		}else if(36<=rank && rank<=55){
			score=1.0371139743 * ((212.61 * Math.pow(1.036,(1 - rank))) + 25.071)
		}else if(21<=rank && rank<=35){
			score=((250 - 83.389) * Math.pow(1.0099685,(2 - rank)) - 31.152) * 1.0371139743
		}else if(4<=rank && rank<=20){
			score=((326.1 * Math.exp(-0.0871 * rank)) + 51.09) * 1.037117142
		}else if(1<=rank && rank<=3){
			score=(-18.2899079915 * rank) + 368.2899079915
        }else{
            score=0;
        }
    if(percent !== 100){
        score = commonProgress(score, percent, 67);
    }
    return Math.max(round(score), 0);
}
export function commonProgress(score, progress, requirement) {
		return score * Math.pow(5,  ((progress - requirement)/(100 - requirement))  )   /10;
	}
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
