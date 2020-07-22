document.addEventListener('DOMContentLoaded', () =>{
    console.log('DOMContentLoaded')

    const mainGrid = document.querySelector("div#robot-collection")

    fetchAllRobots()

    function ce(element) {
        return document.createElement(element)
    }
    
    function fetchAllRobots() {
        fetch('http://localhost:3000/robots')
        .then(res => res.json())
        .then(robots => showRobots(robots))
    }
    
    function showRobots(robots) {
        robots.forEach(robot => showRobot(robot))
    }
    
    function showRobot(robot){
        console.log(robot)
        const card = ce('div')
        card.className = "robot-card"
    
        const name = ce('h2')
        name.innerText = robot.name
    
        const author = ce('h4')
        author.innerText = robot.author
    
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
    
        mainGrid.append(card)
    }
})