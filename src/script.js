document.addEventListener('DOMContentLoaded', () =>{
    console.log('DOMContentLoaded')

    //Important definitions


    //Actions
    mainMenu()


    //Functions
    function ce(element) {
        return document.createElement(element)
    }

    function mainMenu(){
        document.body.innerHTML = ""

        const myRobotsBtn = ce('button')
        myRobotsBtn.innerText = 'My Robots'

        myRobotsBtn.addEventListener('click', () => {
            fetchMyRobots('display')
        })

        const allRobotsBtn = ce('button')
        allRobotsBtn.innerText = 'All Robots'

        allRobotsBtn.addEventListener('click', () => {
            fetchAllRobots('display')
        })

        const playBtn = ce('button')
        playBtn.innerText = 'Play!'

        playBtn.addEventListener('click', () => {
            fetchMyRobots('fight')
        })

        document.body.append(playBtn, myRobotsBtn, allRobotsBtn)
    }
    
    function fetchMyRobots(mode) {
        document.body.innerHTML = ""

        fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(users => users.filter(user => user.id == 1)) //change to current user's id
        .then(user => user.map(user => user.robots))
        .then(robots => showMyRobots(robots, mode))
    }
    
    function fetchAllRobots(mode){
        document.body.innerHTML = ""

        fetch('http://localhost:3000/robots')
        .then(res => res.json())
        .then(robots => showAllRobots(robots, mode))
    }

    function showMyRobots(robots, mode) {

        const mainGrid = ce('div')
        mainGrid.className = 'main-grid'
        document.body.append(mainGrid)

        if(mode == 'fight'){
            const fightMessage = ce('h1')
            fightMessage.innerText = 'Pick a Robot!'
            document.body.prepend(fightMessage)
        }


        const homeBtn = ce('button')
        homeBtn.innerText = 'Home'

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })
        document.body.prepend(homeBtn)


        robots = Object.values(robots[0])
        robots.forEach(robot => showRobot(robot, mode, mainGrid))        
    }

    function showAllRobots(robots, mode){
        const mainGrid = ce('div')
        mainGrid.className = 'main-grid'
        document.body.append(mainGrid)

        const homeBtn = ce('button')
        homeBtn.innerText = 'Home'

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })
        document.body.prepend(homeBtn)


        robots.forEach(robot => showRobot(robot, mode, mainGrid))
    }
    
    function showRobot(robot, mode, grid){

        const card = ce('div')
        card.className = "robot-card"
    
        const name = ce('h2')
        name.innerText = robot.name
    
        const author = ce('h4')
        author.innerText = `Created by: ${robot.author}`
    
        const head = ce('img')
        head.src = robot.parts[0].image_url
        head.className = "robot-image"
    
        const torso = ce('img')
        torso.src = robot.parts[1].image_url
        torso.className = "robot-image"
    
        const lowerBody = ce('img')
        lowerBody.src = robot.parts[2].image_url
        lowerBody.className = "robot-image"
    
        const statsDiv = ce('div')
        statsDiv.className = "stats-card"
    
        const stats = ce('h3')
        stats.innerText = 'Stats'
    
        const health = ce('p')
        health.innerText = `Health: ${Math.round(robot.health)}`
    
        const batteryLife = ce('p')
        batteryLife.innerText = `Battery Life: ${Math.round(robot.battery_life)}`
    
        const speed = ce('p')
        speed.innerText = `Speed: ${Math.round(robot.speed)}`
    
        const attack = ce('p')
        attack.innerText = `Attack: ${Math.round(robot.attack)}`
    
        const defense = ce('p')
        defense.innerText = `Defense: ${Math.round(robot.defense)}`
    
        statsDiv.append(stats, health, batteryLife, speed, attack, defense)
    
        const movesDiv = ce('div')
        movesDiv.className = "moves-card"
    
        const moves = ce('h3')
        moves.innerText = 'Moves'
    
        movesDiv.append(moves)
    
        robot.moves.forEach(move => {
            const name = ce('p')
            name.innerText = move.name
    
            movesDiv.append(name)
        })
    
        const infoGrid = ce('div')
        infoGrid.className = 'info-grid'
    
        infoGrid.append(statsDiv, movesDiv)
        
        card.append(name, author, head, torso, lowerBody, infoGrid)

        if (mode == 'fight'){
            battleBtn = ce('button')
            battleBtn.innerText = 'Fight!'
            battleBtn.className = 'fight-button'

            battleBtn.addEventListener('click', () => {
                console.log(`Fight button clicked with ${robot.name}`)
            })
            card.append(battleBtn)
        }
    
        grid.append(card)
    }
})