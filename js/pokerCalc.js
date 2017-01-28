(function (window) {
    window.pokerCalc = {
        //总共可能
        total: 52 * 51 * 50 / 6,
        //豹子
        threeOfAKing: function (selectedArr) {
            //总数
            if (!selectedArr) return 13;
            var num = selectedArr[0][0];
            return 13 - num;
        },
        //同花顺
        straightFlush: function (selectedArr) {
            if (!selectedArr) return 12 * 4;
            // A12特殊情况
            if (selectedArr[2][0] === 13 && selectedArr[1][0] === 2)
                return 11 * 4 + this.threeOfAKing();
            var num = selectedArr[2][0];
            return (13 - num) * 4 + this.threeOfAKing();
        },
        //同花
        flush: function (selectedArr) {
            if (!selectedArr) return 4 * (13 * 12 * 11 / 6 - 6);
            return ((13 - selectedArr[2][0]) * 12 * 11 / 6 + (13 - selectedArr[1][0]) * (selectedArr[1][0] - 1) / 2 + (13 - selectedArr[0][0])) * 4 + this.threeOfAKing() + this.straightFlush();
        },
        //顺子
        straight: function (selectedArr) {
            if (!selectedArr) return (4 * 4 * 4 - 4) * 12;
            //A12特殊情况
            if (selectedArr[2][0] === 13 && selectedArr[1][0] === 2)
                return (4 * 4 * 4 - 4) * 11 + this.threeOfAKing() + this.straightFlush() + this.flush();
            var num = selectedArr[2][0];
            return (4 * 4 * 4 - 4) * (13 - num) + this.threeOfAKing() + this.straightFlush() + this.flush();
        },
        //对子
        onePairs: function(selectedArr) {
            if(!selectedArr) return 4*3/2*12*4*13;
            //对子,单牌
            var pnum = selectedArr[0][0],
                snum = selectedArr[2][0];
            if(selectedArr[1][0] !== pnum){
                pnum = selectedArr[1][0];
                snum = selectedArr[0][0];
            }

            return 4*3/2*(13 - pnum)*12*4 + (13-snum)*4 + this.threeOfAKing() + this.straightFlush() + this.flush() + this.straight();
        },
        //乱牌
        single: function(selectedArr) {
            if(!selectedArr) return 16440;
            return (13 - selectedArr[2][0])*4*51*50/6 + (13- selectedArr[1][0])*4*51 + (13-selectedArr[0][0])*4 + this.threeOfAKing() + this.straightFlush() + this.flush() + this.straight() + this.onePairs();
        },
        calc:function(selectedPokers) {
            var selectedArr = [];
            var result;
            selectedPokers.forEach(function(poker) {
                selectedArr.push([window.pokerMap[poker.slice(0, -1)], poker.slice(-1)]);
            });
            selectedArr.sort(function(item1, item2) {
                return item1[0] - item2[0];
            });
            //豹子
            if(selectedArr[0][0] === selectedArr[1][0] && selectedArr[0][0] === selectedArr[2][0]){
                result = this.threeOfAKing(selectedArr);
            }else if(selectedArr[0][1] === selectedArr[1][1] && selectedArr[0][1] === selectedArr[2][1]) {
                //同花顺
                if(selectedArr[0][0] + 1 === selectedArr[1][0] && (selectedArr[1][0] + 1=== selectedArr[2][0] || selectedArr[0][0] === 2 && selectedArr[2][0] === 13)){
                    result = this.straightFlush(selectedArr);
                }else{
                    //同花
                    result = this.flush(selectedArr);
                }
            }else if(selectedArr[0][0] + 1 === selectedArr[1][0] && (selectedArr[1][0] + 1=== selectedArr[2][0] || selectedArr[0][0] === 2 && selectedArr[2][0] === 13)){
                //顺子
                result = this.straight(selectedArr);
            }else if(selectedArr[0][0] === selectedArr[1][0] || selectedArr[1][0] === selectedArr[2][0] || selectedArr[2][0] === selectedArr[0][0]){
                result = this.onePairs(selectedArr);
            }else {
                result = this.single(selectedArr);
            }
            return (1 - result  / this.total);
        },
        calcAllRate: function(selectedPokers, players) {
            return Math.pow(this.calc(selectedPokers), players - 1);
        },
        calcExpectIncome: function(selectedPokers, players) {
            var rate = this.calcAllRate(selectedPokers, players);
            return rate*(players - 1)*2 - (1-rate)*5;
        }
    };
})(window);
