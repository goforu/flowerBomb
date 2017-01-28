(function (window) {
    'use strict';
    window.monterCarlo = {
        //随机局数
        times: 100000,
        players: 2,
        //自己标准化后的牌
        pokerArr: null,
        //除自己的牌剩余牌
        pokers: null,
        //除玩家的牌剩余牌
        restPokers: null,
        //乱牌0， 对子1，顺子2，同花3，同花顺4，豹子5
        rate: -1,
        getCalcResult: function () {
            var counts = this.times;
            var wins = 0;
            while (counts > 0) {
                for (var i = 0; i < this.players - 1; i++) {
                    if (!this.isLarger(this.generate())) break;
                }
                if (i === this.players - 1) wins++;
                counts--;
                this.reset();
            }
            var chance = wins / this.times;
            return {
                //胜率
                chance: chance * 100 + '%',
                //期望收益
                expect: (chance * (this.players - 1) * 2 - (1 - chance) * 5) * 20 + '%'
            }
        },
        init: function (pokerGroup, players) {
            this.players = players;
            //除了自己的牌，剩余的牌
            this.pokers = [].concat(window.pokers);
            pokerGroup.forEach((function (poker) {
                this.pokers.splice(this.pokers.indexOf(poker), 1);
            }).bind(this));
            this.pokerArr = this.standarize(pokerGroup);
            this.rate = this.rateGroup(this.pokerArr);
            this.reset();
        },
        //标准数组加排序
        standarize: function (pokerGroup) {
            var pokerArr = [];
            pokerGroup.forEach(function (poker) {
                var p = poker.split(' ');
                p[0] = window.pokerMap[p[0]];
                pokerArr.push(p);
            });
            pokerArr.sort(function (poker1, poker2) {
                return poker1[0] - poker2[0];
            });
            return pokerArr;
        },
        //对牌评级
        rateGroup: function (pokerArr) {
            if (pokerArr[0][0] === pokerArr[1][0] && pokerArr[0][0] === pokerArr[2][0]) {
                //豹子
                return 5;
            } else if (pokerArr[0][1] === pokerArr[1][1] && pokerArr[0][1] === pokerArr[2][1]) {
                //同花顺
                if (pokerArr[0][0] + 1 === pokerArr[1][0] && (pokerArr[1][0] + 1 === pokerArr[2][0] || pokerArr[0][0] === 2 && pokerArr[2][0] === 13)) {
                    return 4;
                } else {
                    //同花
                    return 3;
                }
            } else if (pokerArr[0][0] + 1 === pokerArr[1][0] && (pokerArr[1][0] + 1 === pokerArr[2][0] || pokerArr[0][0] === 2 && pokerArr[2][0] === 13)) {
                //顺子
                return 2;
            } else if (pokerArr[0][0] === pokerArr[1][0] || pokerArr[1][0] === pokerArr[2][0] || pokerArr[2][0] === pokerArr[0][0]) {
                //对子
                return 1;
            } else {
                //乱牌
                return 0;
            }
        },
        //重置
        reset: function () {
            //玩家抽排后剩余的牌数
            this.restPokers = this.pokers.slice();
        },
        //生成任意一组牌
        generate: function () {
            var pokerGroup = [];
            while (pokerGroup.length < 3) {
                //随机抽取
                var randomIndex = Math.floor(this.restPokers.length * Math.random());
                pokerGroup.push(this.restPokers.splice(randomIndex, 1)[0]);
            }
            return pokerGroup;
        },
        //比较牌面大小
        isLarger: function (group) {
            var groupArr = this.standarize(group);
            var randomRate = this.rateGroup(groupArr);
            if (this.rate > randomRate) {
                return true;
            } else if (this.rate < randomRate) {
                return false;
            } else {
                switch (this.rate) {
                    //豹子
                    case 5:
                        return this.pokerArr[0][0] > groupArr[0][0];
                    //同花顺
                    case 4:
                        // A12特殊情况
                        if (this.pokerArr[2][0] === 13 && this.pokerArr[0][0] === 1) return false;
                        if (groupArr[2][0] === 13 && groupArr[0][0] === 1) return true;
                        return this.pokerArr[2][0] > groupArr[2][0];
                    //同花
                    case 3:
                        if (this.pokerArr[2][0] > groupArr[2][0]) return true;
                        else if (this.pokerArr[2][0] === groupArr[2][0]) {
                            if (this.pokerArr[1][0] > groupArr[1][0]) return true;
                            else if (this.pokerArr[1][0] === groupArr[1][0]) {
                                return this.pokerArr[0][0] > groupArr[0][0]
                            }
                            return false;
                        }
                        return false;
                    //顺子
                    case 2:
                        // A12特殊情况
                        if (this.pokerArr[2][0] === 13 && this.pokerArr[0][0] === 1) return false;
                        if (groupArr[2][0] === 13 && groupArr[0][0] === 1) return true;
                        return this.pokerArr[2][0] > groupArr[2][0];
                    //对子
                    case 1:
                        var pnum = this.pokerArr[0][0],
                            snum = this.pokerArr[2][0];
                        if (this.pokerArr[1][0] !== pnum) {
                            pnum = this.pokerArr[1][0];
                            snum = this.pokerArr[0][0];
                        }

                        var pnum2 = groupArr[0][0],
                            snum2 = groupArr[2][0];
                        if (groupArr[1][0] !== pnum2) {
                            pnum2 = groupArr[1][0];
                            snum2 = groupArr[0][0];
                        }
                        if (pnum > pnum2) return true;
                        else if (pnum === pnum2) {
                            return snum > snum2;
                        }
                        return false;
                    //乱牌
                    case 0:
                        if (this.pokerArr[2][0] > groupArr[2][0]) return true;
                        else if (this.pokerArr[2][0] === groupArr[2][0]) {
                            if (this.pokerArr[1][0] > groupArr[1][0]) return true;
                            else if (this.pokerArr[1][0] === groupArr[1][0]) {
                                return this.pokerArr[0][0] > groupArr[0][0]
                            }
                            return false;
                        }
                        return false;
                }
            }
        }
    }
})(window);