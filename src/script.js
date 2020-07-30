document.addEventListener('DOMContentLoaded', () =>{
    console.log('DOMContentLoaded')


    //Global variables
    var currentUser = null
    var mainSong = new Audio('audio/9_Boss_1_Master.mp3')
    var clickSound = new Audio('audio/click.wav')


    //Actions
    welcome()

    //Important functions and variables
    function ce(element) {
        return document.createElement(element)
    }

    function randomElement(array){
        return array[Math.floor(Math.random() * array.length)]
    }

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    function playMainSong(){
        document.body.append(mainSong)
        mainSong.play()
    }

    function playClick(){
        document.body.append(clickSound)
        clickSound.play()
    }

    function welcome(){
        document.body.innerHTML = ""

        let header = ce('h1')
        header.innerText = "Welcome"

        let loginBtn = ce('button')
        loginBtn.innerText = "Log In"

        let signupBtn = ce('button')
        signupBtn.innerText = "Sign Up"

        document.body.append(header, loginBtn, signupBtn)

        loginBtn.addEventListener('click', () => {
            logIn()
        })

        signupBtn.addEventListener('click', () => {
            signUp()
        })
    }

    function logIn(invalid = false){
        document.body.innerHTML = ""

        let header = ce('h1')
        header.innerText = "Log In"

        let message = ce('p')

        if(invalid){
            message.innerText = "Invalid User Name, please try again."
        }

        let loginForm = ce('form')

        let userNameLabel = ce('label')
        userNameLabel.innerText = 'User Name: '

        let userNameInput = ce('input')
        userNameInput.name = "username"
        userNameInput.type = 'text'

        let submit = ce('input')
        submit.type = 'submit'
        submit.value = 'Log In'

        loginForm.append(header, message, userNameLabel, userNameInput, submit)
        document.body.append(loginForm)

        loginForm.addEventListener('submit', () => {
            event.preventDefault()
            let input = event.target[0].value

            fetch('http://localhost:3000/users')
            .then(res => res.json())
            .then(users => {
                let user = users.find(user => user.user_name == input)
                if(user){
                    currentUser = user
                    mainMenu()
                }
                else{
                    logIn(invalid = true)
                }
            })
        })
    }

    function logOut(){
        currentUser = null
        welcome()
    }

    function signUp(){
        document.body.innerHTML = ""

        let header = ce('h1')
        header.innerText = "Sign Up"

        let signupForm = ce('form')

        let userNameLabel = ce('label')
        userNameLabel.innerText = 'User Name: '

        let userNameInput = ce('input')
        userNameInput.name = "username"
        userNameInput.type = 'text'

        let submit = ce('input')
        submit.type = 'submit'
        submit.value = 'Sign Up'

        signupForm.append(header, userNameLabel, userNameInput, submit)
        document.body.append(signupForm)

        signupForm.addEventListener('submit', () => {
            event.preventDefault()
            let input = event.target[0].value

            let configObj = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user_name": input
                })
            }

            fetch('http://localhost:3000/users', configObj)
            .then(res => res.json())
            .then(user => {
                currentUser = user
                mainMenu()
            })
        })
    }

    function userSettings(){
        document.body.innerHTML = ""

        let homeBtn = ce('button')
        homeBtn.innerText = 'Home'

        let editUserNameBtn = ce('button')
        editUserNameBtn.innerText = "Edit User Name"

        let deleteUserBtn = ce('button')
        deleteUserBtn.innerText = "Delete Account"

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })

        editUserNameBtn.addEventListener('click', () => {
            editUserName()
        })

        deleteUserBtn.addEventListener('click', () => {
            deleteUser()
        })

        document.body.append(homeBtn, editUserNameBtn, deleteUserBtn)
    }

    function editUserName(){
        let editForm = ce('form')

        let newUserNameLabel = ce('label')
        newUserNameLabel.innerText = "Enter New User Name: "

        let newUserNameInput = ce('input')
        newUserNameInput.name = "username"
        newUserNameInput.type = 'text'

        let submit = ce('input')
        submit.type = 'submit'
        submit.value = 'Submit'

        editForm.append(newUserNameLabel, newUserNameInput, submit)

        document.body.append(editForm)

        editForm.addEventListener('submit', () => {
            event.preventDefault()

            let configObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "old_user_name": currentUser.user_name,
                    "new_user_name": event.target[0].value
                })
            }
            fetch(`http://localhost:3000/users/${currentUser.id}`, configObj)
            .then(res => res.json())
            .then(user => {
                currentUser = user
                mainMenu()
            })
        })
    }

    function deleteUser(){

        let configObj = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user_id": currentUser.id
            })
        }
        fetch(`http://localhost:3000/users/${currentUser.id}`, configObj)
        .then(() => {
            currentUser = null
            welcome()
        })
    }

    function mainMenu(){
        document.body.innerHTML = ""

        let welcomeUser = ce('h1')
        welcomeUser.innerText = `Welcome ${currentUser.user_name}!`

        let myRobotsBtn = ce('button')
        myRobotsBtn.innerText = 'My Robots'

        myRobotsBtn.addEventListener('click', () => {
            fetchMyRobots('display')
        })

        let allRobotsBtn = ce('button')
        allRobotsBtn.innerText = 'All Robots'

        allRobotsBtn.addEventListener('click', () => {
            fetchAllRobots('all')
        })

        let playBtn = ce('button')
        playBtn.innerText = 'Play!'

        playBtn.addEventListener('click', () => {
            fetchMyRobots('fight')
        })

        let createBtn = ce('button')
        createBtn.innerText = 'Create a Robot!'

        createBtn.addEventListener('click', () => {
            createScreen(mode = 'create')
        })

        let userSettingsBtn = ce('button')
        userSettingsBtn.innerText = "User Settings"

        userSettingsBtn.addEventListener('click', () => {
            userSettings()
        })

        let logoutBtn = ce('button')
        logoutBtn.innerText = 'Logout'

        logoutBtn.addEventListener('click', () => {
            logOut()
        })

        document.body.append(welcomeUser, playBtn, myRobotsBtn, allRobotsBtn, createBtn, userSettingsBtn, logoutBtn)
    }

    function createScreen(mode, bot = null){
        let partsToSend = null

        fetch('http://localhost:3000/parts')
        .then(res => res.json())
        .then(parts => {
            partsToSend = parts
        })
        .then(() => {
            fetch('http://localhost:3000/moves')
            .then(res => res.json())
            .then(moves => createForm(partsToSend, moves, mode, bot))
        }
        )
    }

    function createForm(parts, moves, mode, bot){
        document.body.innerHTML = ""

        let mainGrid = ce('div')
        mainGrid.className = 'main-grid'

        let heads = parts.filter(part => part.category == 'head')
        let torsos = parts.filter(part => part.category == 'torso')
        let lowerBodies = parts.filter(part => part.category == 'lower_body')
        

        heads.forEach(head => {

            let headShowcase = ce('div')
            headShowcase.className = 'part-card'

            let image = ce('img')
            image.src = head.image_url
            image.className = 'robot-image'

            let name = ce('h2')
            name.innerText = head.name

            let description = ce('h3')
            description.innerText = head.description

            let health = ce('p')
            health.innerText = `Health: ${head.health}`

            let batteryLife = ce('p')
            batteryLife.innerText = `Battery Life: ${head.battery_life}`

            let speed = ce('p')
            speed.innerText = `Speed: ${head.speed}`

            let attack = ce('p')
            attack.innerText = `Attack: ${head.attack}`

            let defense = ce('p')
            defense.innerText = `Defense: ${head.defense}`

            headShowcase.append(image, name, description, health, batteryLife, speed, attack, defense)
            mainGrid.append(headShowcase)
        })

        torsos.forEach(torso => {

            let torsoShowcase = ce('div')
            torsoShowcase.className = 'part-card'

            let image = ce('img')
            image.src = torso.image_url
            image.className = 'robot-image'

            let name = ce('h2')
            name.innerText = torso.name

            let description = ce('h3')
            description.innerText = torso.description

            let health = ce('p')
            health.innerText = `Health: ${torso.health}`

            let batteryLife = ce('p')
            batteryLife.innerText = `Battery Life: ${torso.battery_life}`

            let speed = ce('p')
            speed.innerText = `Speed: ${torso.speed}`

            let attack = ce('p')
            attack.innerText = `Attack: ${torso.attack}`

            let defense = ce('p')
            defense.innerText = `Defense: ${torso.defense}`

            torsoShowcase.append(image, name, description, health, batteryLife, speed, attack, defense)
            mainGrid.append(torsoShowcase)
        })

        lowerBodies.forEach(lowerBody => {

            let lowerBodyShowcase = ce('div')
            lowerBodyShowcase.className = 'part-card'

            let image = ce('img')
            image.src = lowerBody.image_url
            image.className = 'robot-image'

            let name = ce('h2')
            name.innerText = lowerBody.name

            let description = ce('h3')
            description.innerText = lowerBody.description

            let health = ce('p')
            health.innerText = `Health: ${lowerBody.health}`

            let batteryLife = ce('p')
            batteryLife.innerText = `Battery Life: ${lowerBody.battery_life}`

            let speed = ce('p')
            speed.innerText = `Speed: ${lowerBody.speed}`

            let attack = ce('p')
            attack.innerText = `Attack: ${lowerBody.attack}`

            let defense = ce('p')
            defense.innerText = `Defense: ${lowerBody.defense}`

            lowerBodyShowcase.append(image, name, description, health, batteryLife, speed, attack, defense)
            mainGrid.append(lowerBodyShowcase)
        })

        moves.forEach(move => {
            let moveShowcase = ce('div')
            moveShowcase.className = 'move-card'

            let name = ce('h2')
            name.innerText = move.name

            let category = ce('h3')
            category.innerText = `Category: ${move.category}`

            let description = ce('p')
            description.innerText = move.description

            let cost = ce('p')
            cost.innerText = `Battery Life Cost: ${move.cost}`

            moveShowcase.append(name, category, description, cost)
            mainGrid.append(moveShowcase)
        })

        let homeBtn = ce('button')
        homeBtn.innerText = "Home"

        let robotForm = ce('form')

        let author = ce('input')
        author.type = 'hidden'
        author.name = 'author'
        author.value = currentUser.user_name

        let robotNameLabel = ce('label')
        robotNameLabel.innerText = 'Robot Name: '

        let robotNameInput = ce('input')
        robotNameInput.name = "name"
        robotNameInput.type = 'text'

        let robotHeadLabel = ce('label')
        robotHeadLabel.innerText = " Robot Head: "
        
        let robotHeadSelect = ce('select')
        robotHeadSelect.name = "heads"
        robotHeadSelect.id = 'heads'


        heads.forEach(head => {
            let option = ce('option')
            option.value = head.id
            option.innerText = head.name

            robotHeadSelect.append(option)
        })

        let robotTorsoLabel = ce('label')
        robotTorsoLabel.innerText = " Robot Torso: "

        let robotTorsoSelect = ce('select')
        robotTorsoSelect.name = "torsos"
        robotTorsoSelect.id = 'torsos'


        torsos.forEach(torso => {
            let option = ce('option')
            option.value = torso.id
            option.innerText = torso.name

            robotTorsoSelect.append(option)
        })

        let robotLowerBodiesLabel = ce('label')
        robotLowerBodiesLabel.innerText = " Robot Lower Body: "

        let robotLowerBodiesSelect = ce('select')
        robotLowerBodiesSelect.name = "torsos"
        robotLowerBodiesSelect.id = 'torsos'


        lowerBodies.forEach(lowerBody => {
            let option = ce('option')
            option.value = lowerBody.id
            option.innerText = lowerBody.name

            robotLowerBodiesSelect.append(option)
        })

        let move1Label = ce('label')
        move1Label.innerText = " Move 1: "

        let move1Select = ce('select')

        moves.forEach(move => {
            let option = ce('option')
            option.value = move.id
            option.innerText = move.name

            move1Select.append(option)
        })

        let move2Label = ce('label')
        move2Label.innerText = " Move 2: "

        let move2Select = ce('select')

        moves.forEach(move => {
            let option = ce('option')
            option.value = move.id
            option.innerText = move.name

            move2Select.append(option)
        })

        let move3Label = ce('label')
        move3Label.innerText = " Move 3: "

        let move3Select = ce('select')

        moves.forEach(move => {
            let option = ce('option')
            option.value = move.id
            option.innerText = move.name

            move3Select.append(option)
        })

        let submit = ce('input')
        submit.type = "submit"
        submit.value = "Create!"

        robotForm.append(author, robotNameLabel, robotNameInput, robotHeadLabel, robotHeadSelect, robotTorsoLabel, robotTorsoSelect, robotLowerBodiesLabel, robotLowerBodiesSelect, move1Label, move1Select, move2Label, move2Select, move3Label, move3Select, submit)
        document.body.append(homeBtn, robotForm, mainGrid)

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })

        robotForm.addEventListener('submit', () => {
            event.preventDefault()

            let configObj = {}

            if(mode == 'create'){
                configObj = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "author": event.target[0].value,
                        "name": event.target[1].value,
                        "parts": [event.target[2].value, event.target[3].value, event.target[4].value],
                        "moves": [event.target[5].value, event.target[6].value, event.target[7].value]
                    })
                }
            }
            else if(mode == 'edit'){
                configObj = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "id": bot.id,
                        "author": event.target[0].value,
                        "name": event.target[1].value,
                        "parts": [event.target[2].value, event.target[3].value, event.target[4].value],
                        "moves": [event.target[5].value, event.target[6].value, event.target[7].value]
                    })
                }
            }

            if(mode == 'create'){
                fetch('http://localhost:3000/robots', configObj)
                .then(res => res.json())
                .then(() => fetchMyRobots('display'))
            }
            else if(mode == 'edit'){
                fetch(`http://localhost:3000/robots/${bot.id}`, configObj)
                .then(res => res.json())
                .then(() => fetchMyRobots('display'))
            }
            

            // .then(robot =>{
            //     let configObj = {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({
            //             "head": event.target[2].value,
            //             "torso": event.target[3].value,
            //             "lower_body": event.target[4].value
            //         })
            //     }
            //     fetch('http://localhost:3000/robot_parts')
            // })
        })
    }
    
    function fetchMyRobots(mode) {
        document.body.innerHTML = ""

        fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(users => users.filter(user => user.user_name == currentUser.user_name))
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

        let mainGrid = ce('div')
        mainGrid.className = 'main-grid'
        document.body.append(mainGrid)

        if(mode == 'fight'){
            let fightMessage = ce('h1')
            fightMessage.innerText = 'Pick a Robot!'
            document.body.prepend(fightMessage)
        }


        let homeBtn = ce('button')
        homeBtn.innerText = 'Home'

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })
        document.body.prepend(homeBtn)


        robots = Object.values(robots[0])
        robots.forEach(robot => showRobot(robot, mode, mainGrid))        
    }

    function showAllRobots(robots, mode){
        let mainGrid = ce('div')
        mainGrid.className = 'main-grid'
        document.body.append(mainGrid)

        let homeBtn = ce('button')
        homeBtn.innerText = 'Home'

        homeBtn.addEventListener('click', () => {
            mainMenu()
        })
        document.body.prepend(homeBtn)


        robots.forEach(robot => showRobot(robot, mode, mainGrid))
    }
    
    function showRobot(robot, mode, grid){

        let card = ce('div')

        if(mode == 'edit'){
            card.className = "robot-card-edit"
        }
        else if(mode == 'display'){
            card.className = "robot-card"
        }
        else{
            card.className = "robot-card-all"
        }

        let name = ce('h2')
        name.innerText = robot.name
    
        let author = ce('h4')
        author.innerText = `Created by: ${robot.user.user_name}`
    
        let head = ce('img')
        let headPart = robot.parts.find(part => part.category == 'head')
        head.src = headPart.image_url
        head.className = "robot-image"
    
        let torso = ce('img')
        let torsoPart = robot.parts.find(part => part.category == 'torso')
        torso.src = torsoPart.image_url
        torso.className = "robot-image"
    
        let lowerBody = ce('img')
        let lowerBodyPart = robot.parts.find(part => part.category == 'lower_body')
        lowerBody.src = lowerBodyPart.image_url
        lowerBody.className = "robot-image"
    
        let statsDiv = ce('div')
        statsDiv.className = "stats-card"
    
        let stats = ce('h3')
        stats.innerText = 'Stats'
    
        let health = ce('p')
        health.innerText = `Health: ${Math.round(robot.health)}`
    
        let batteryLife = ce('p')
        batteryLife.innerText = `Battery Life: ${Math.round(robot.battery_life)}`
    
        let speed = ce('p')
        speed.innerText = `Speed: ${Math.round(robot.speed)}`
    
        let attack = ce('p')
        attack.innerText = `Attack: ${Math.round(robot.attack)}`
    
        let defense = ce('p')
        defense.innerText = `Defense: ${Math.round(robot.defense)}`
    
        statsDiv.append(stats, health, batteryLife, speed, attack, defense)
    
        let movesDiv = ce('div')
        movesDiv.className = "moves-card"
    
        let moves = ce('h3')
        moves.innerText = 'Moves'
    
        movesDiv.append(moves)
    
        robot.moves.forEach(move => {
            let name = ce('p')
            name.innerText = move.name
    
            movesDiv.append(name)
        })
    
        let infoGrid = ce('div')
        infoGrid.className = 'info-grid'
    
        infoGrid.append(statsDiv, movesDiv)
        
        card.append(name, author, head, torso, lowerBody, infoGrid)

        if (mode == 'fight'){
            battleBtn = ce('button')
            battleBtn.innerText = 'Fight!'
            battleBtn.className = 'fight-button'

            battleBtn.addEventListener('click', () => {
                setBattle(robot)
            })
            card.append(battleBtn)
        }

        if (mode == 'display'){
            let editBtn = ce('button')
            editBtn.innerText = 'Edit Robot'

            editBtn.addEventListener('click', () => {
                createScreen(mode = 'edit', bot = robot)
            })

            let deleteBtn = ce('button')
            deleteBtn.innerText = 'Delete Robot'

            deleteBtn.addEventListener('click', () => {
                deleteRobot(robot)
            })

            card.append(editBtn, deleteBtn)
        }
    
        grid.append(card)
    }

    function deleteRobot(robot){
        let configObj = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "robot_id": robot.id
            })
        }
        fetch(`http://localhost:3000/robots/${robot.id}`, configObj)
        .then(mainMenu())
    }

    function setBattle(attacker){
        fetch('http://localhost:3000/robots')
        .then(res => res.json())
        .then(robots => battle(robots, attacker))
     
    }

    function battle(robots, attacker){
        document.body.innerHTML = ""
        playMainSong()
        robots = robots.filter(robot => robot.id != attacker.id) //making sure no robot fights itself
        let opponent = randomElement(robots) //selecting a random opponent

        let battleGrid = ce('div')
        battleGrid.className = 'battle-grid'
        document.body.append(battleGrid)

        //Attacker Box
        let attackerBox = ce('div')
        attackerBox.className = 'attacker-box'

        let attackerName = ce('h2')
        attackerName.innerText = attacker.name

        let attackerHealth = ce('h3')
        attackerHealth.id = 'attacker-health'
        attackerHealth.innerText = `Your Health: ${Math.round(attacker.health)}`

        let attackerBatteryLife = ce('h3')
        attackerBatteryLife.id = 'attacker-battery-life'
        attackerBatteryLife.innerText = `Your Battery Life: ${Math.round(attacker.battery_life)}`

        let attackerHead = ce('img')
        attackerHead.className = 'robot-image'
        let attackerHeadPart = attacker.parts.find(part => part.category == 'head')
        attackerHead.src = attackerHeadPart.image_url

        let attackerTorso = ce('img')
        attackerTorso.className = 'robot-image'
        let attackerTorsoPart = attacker.parts.find(part => part.category == 'torso')
        attackerTorso.src = attackerTorsoPart.image_url

        let attackerLowerBody = ce('img')
        attackerLowerBody.className = 'robot-image'
        let attackerLowerBodyPart = attacker.parts.find(part => part.category == 'lower_body')
        attackerLowerBody.src = attackerLowerBodyPart.image_url

        attackerBox.append(attackerName, attackerHealth, attackerBatteryLife, attackerHead, attackerTorso, attackerLowerBody)


        //Battle Box
        let battleBox = ce('div')
        battleBox.className = 'battle-box'
        battleBox.id = 'battle-box'


        //Opponent Box
        let opponentBox = ce('div')
        opponentBox.className = 'opponent-box'

        let opponentName = ce('h2')
        opponentName.innerText = opponent.name

        let opponentHealth = ce('h3')
        opponentHealth.id = 'opponent-health'
        opponentHealth.innerText = `Opponent Health: ${Math.round(opponent.health)}`

        let opponentBatteryLife = ce('h3')
        opponentBatteryLife.id = 'opponent-battery-life'
        opponentBatteryLife.innerText = `Opponent Battery Life: ${Math.round(opponent.battery_life)}`

        let opponentHead = ce('img')
        opponentHead.className = 'robot-image'
        let opponentHeadPart = opponent.parts.find(part => part.category == 'head')
        opponentHead.src = opponentHeadPart.image_url

        let opponentTorso = ce('img')
        opponentTorso.className = 'robot-image'
        let opponentTorsoPart = opponent.parts.find(part => part.category == 'torso')
        opponentTorso.src = opponentTorsoPart.image_url

        let opponentLowerBody = ce('img')
        opponentLowerBody.className = 'robot-image'
        let opponentLowerBodyPart = opponent.parts.find(part => part.category == 'lower_body')
        opponentLowerBody.src = opponentLowerBodyPart.image_url

        opponentBox.append(opponentName, opponentHealth, opponentBatteryLife, opponentHead, opponentTorso, opponentLowerBody)

        //Control Panel
        let controlPanel = ce('div')
        controlPanel.className = 'control-panel'

        attacker.moves.forEach(move => {
            let attackBtn = ce('button')
            attackBtn.id = 'attack-button'
            attackBtn.innerText = `${move.name}\nBattery Cost: ${move.cost}`
            attackBtn.className = `${move.category}-move-button`

            controlPanel.append(attackBtn)

            attackBtn.addEventListener('click', () => {
                displayStats()

                attackBtns = document.querySelectorAll('#attack-button')
                attackBtns.forEach(button => button.disabled = true)

                let first = whoGoesFirst(attacker, opponent)

                if(first == attacker){
                    performMove(attacker)
                    displayStats()
                    if(!gameFinished(attacker, opponent)){
                        sleep(2000).then(() => {
                            printToScreen('\n')
                            performMove(opponent)
                            printToScreen('\n')
                            displayStats()
                            if(!gameFinished(attacker, opponent)){
                                attackBtns.forEach(button => button.disabled = false)
                            }
                            else{
                                gameOver(attacker, opponent)
                            }
                        })
                    }
                    else{
                        gameOver(attacker, opponent)
                    }
                }
                else if(first == opponent){
                    performMove(opponent)
                    displayStats()
                    if(!gameFinished(attacker, opponent)){
                        sleep(2000).then(() => {
                            printToScreen('\n')
                            performMove(attacker)
                            printToScreen('\n')
                            displayStats()
                            if(!gameFinished(attacker, opponent)){
                                attackBtns.forEach(button => button.disabled = false)
                            }
                            else{
                                displayStats()
                                gameOver(attacker, opponent)
                            }
                        })
                    }
                    else{
                        displayStats()
                        gameOver(attacker, opponent)
                    }
                }

                function gameFinished(attacker, opponent){
                    if(attacker.health <= 0 || opponent.health <= 0){
                        return true
                    }
                    else{
                        return false
                    }
                }

                function gameOver(attacker, opponent){
                    if(attacker.health <= 0){
                        printToScreen('\nGame over, you ran out of health.')
                    }
                    else if(opponent.health <= 0){
                        printToScreen('\nThe opponent ran out of health, you win!')
                    }
                }


                function performMove(robot){
                    playClick()

                    let struggle = {
                        "id":99,
                        "name":"Struggle",
                        "summary":"a self-damaging last resort",
                        "description":"causes very little damage to the opponent and takes away 1 health point from the user",
                        "category":"offensive",
                        "target":"other",
                        "stat":"health",
                        "value": 5,
                        "cost":0
                    }

                    let self = null
                    let other = null
                    if(robot == opponent){
                        self = robot
                        other = attacker
                        let available_moves = self.moves.filter(move => move.cost <= self.battery_life)
                        if(available_moves.length > 0){
                            move_used = randomElement(available_moves)
                        }
                        else{
                            move_used = struggle 
                        }
                        printToScreen(`${robot.name} used ${move_used.name}, ${move_used.summary}!`)
                    }
                    else if(robot == attacker){
                        self = robot
                        other = opponent
                        if(move.cost <= self.battery_life){
                            move_used = move
                        }
                        else{
                            move_used = struggle
                        }
                        printToScreen(`${robot.name} used ${move_used.name}, ${move_used.summary}!`)
                    }

                    if(move_used.category == 'offensive'){
                        let strength = (Math.random() * ((self.attack + move_used.value) / 2) - (Math.random() * other.defense / 3))
                        if(strength < 3){
                            strength = 3 //every move will do at least 3 damage
                        }
                        other.health -= strength
                        printToScreen(`This caused ${Math.round(strength)} damage!`)

                        if(move_used.name == "Struggle"){
                            self.health -= 5
                        }
                    }
                    else if(move_used.category == 'stat-based'){

                        let target = null

                        if(move_used.target == 'self'){
                            target = self
                        }
                        else if(move_used.target == 'other'){
                            target = other
                        }

                        if(move_used.stat == 'health'){
                            target.health = target.health * (1 + move_used.value/100)
                        }
                        else if(move_used.stat == 'battery_life'){
                            target.battery_life = target.battery_life * (1 + move_used.value/100)
                        }
                        else if(move_used.stat == 'speed'){
                            target.speed = target.speed * (1 + move_used.value/100)
                        }
                        else if(move_used.stat == 'attack'){
                            target.attack = target.attack * (1 + move_used.value/100)
                        }
                        else if(move_used.stat == 'defense'){
                            target.defense = target.defense * (1 + move_used.value/100)
                        }
                    }

                    //Subtracting Move cost
                    self.battery_life -= move_used.cost

                    //Making sure Health doesn't become negative
                    if(self.health < 0){
                        self.health = 0
                    }
                        
                    if(other.health < 0){
                        other.health = 0
                    }
                }
            })

        })

        let quitBtn = document.createElement('button')
        quitBtn.className = 'quit-button'
        quitBtn.innerText = "         Quit          \n _________________"
        controlPanel.append(quitBtn)

        quitBtn.addEventListener('click', () => {
            mainMenu()
        })

        // attackerBox.append(controlPanel)

        //Appending to DOM
        battleGrid.append(attackerBox)
        battleGrid.append(battleBox)
        battleGrid.append(opponentBox)

        document.body.append(battleGrid)
        document.body.append(controlPanel)
        
        function displayStats() {
            document.getElementById('attacker-health').innerText = `Your Health: ${Math.round(attacker.health)}`
            document.getElementById('attacker-battery-life').innerText = `Your Battery Life: ${Math.round(attacker.battery_life)}`

            document.getElementById('opponent-health').innerText = `Opponent Health: ${Math.round(opponent.health)}`
            document.getElementById('opponent-battery-life').innerText = `Opponent Battery Life: ${Math.round(opponent.battery_life)}`
            
        }

        function printToScreen(string){
            battleBox = document.getElementById('battle-box')
            battleBox.innerText = battleBox.innerText + "\n" + string
        }

        function whoGoesFirst(attacker, opponent){
            options = [attacker, opponent]
            if (attacker.speed > opponent.speed){
                return attacker
            }
            else if (opponent.speed > attacker.speed){
                return opponent
            }
            else if (opponent.speed == attacker.speed){
                return randomElement(options)
            }
        }

    }
})