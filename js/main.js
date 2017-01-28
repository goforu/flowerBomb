(function (window) {
    'use strict';
    //已选中的牌
    var selectedPokers = [];
    window.pokers = [];
//牌面映射
    window.pokerMap = {
        '2': 1,
        '3': 2,
        '4': 3,
        '5': 4,
        '6': 5,
        '7': 6,
        '8': 7,
        '9': 8,
        '10': 9,
        'J': 10,
        'Q': 11,
        'K': 12,
        'A': 13
    };
//花色
    var pairs = ['♦', '♣', '♥', '♠'];
// 加载时触发
    window.onload = function () {
        var tableNode = document.getElementById('pokerList');
        var pokerKeys = Object.keys(window.pokerMap);
        pairs.forEach(function (pair) {
            var trNode = document.createElement('tr');
            pokerKeys.forEach(function (key) {
                var tdNode = document.createElement('td');
                var value = key +' ' + pair;
                tdNode.innerText = value;
                window.pokers.push(value);
                tdNode.addEventListener('click', togglePoker);
                trNode.appendChild(tdNode);
            });
            tableNode.appendChild(trNode);
        });
        // 输入人数
        var playersNode = document.getElementById('players');
        playersNode.addEventListener('input', function () {
            refreshResultData();
        });
    };
// 选牌时触发
    function togglePoker(event) {
        var pokerNode = event.target;
        var pokerNodeClasses = pokerNode.classList;
        if (pokerNodeClasses.contains("selected")) {
            pokerNodeClasses.remove('selected');
            selectedPokers.splice(selectedPokers.indexOf(pokerNode.innerText), 1);
            refreshResultData();
        } else if (selectedPokers.length < 3) {
            //最多三张牌
            selectedPokers.push(pokerNode.innerText);
            pokerNodeClasses.add('selected');
            refreshResultData();
        }
    }

// 刷新展示数据
    function refreshResultData() {
        var selectedPokersNode = document.getElementById('selectedPokers');
        selectedPokersNode.innerText = selectedPokers.join(' ');
        var playerNode = document.getElementById('players');
        var rateNode = document.getElementById('rate'),
            expectNode = document.getElementById('expect');
        if(selectedPokers.length === 3 && playerNode.value) {
            window.monterCarlo.init(selectedPokers, playerNode.value);
            var result = window.monterCarlo.getCalcResult();
            rateNode.innerText = result.chance;
            expectNode.innerText = result.expect;
        }else {
            rateNode.innerText = '';
            expectNode.innerText = '';
        }
    }
})(window);
