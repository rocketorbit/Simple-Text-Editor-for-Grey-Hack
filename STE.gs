commands = {}

commands["h"] = {"name": "h", "desc": "Displays this message."}
commands["h"]["run"] = function()
    output = "Commands:" + "\n" 
	for command in commands
		commandData = command.value
		output = output + " " + commandData.name + " " + commandData.desc + "\n"
	end for
    output = output + "Press any key to continue..."
	return user_input(output, false, true)
end function

commands["i"] = {"name":"i", "desc":"Insert a line before a number."}
commands["i"]["run"] = function()
    input = user_input("[Number] [NewText]\n>")
    input = input.split(" ")
    lineNumber = input[0].to_int
    if typeof(lineNumber) != "number" then return user_input("Invalid line number.", false ,true)
    input.pull
    subStr = input.join(" ")
    if lineNumber >= lines.len then
        globals.lines.push(subStr)
        globals.text = lines.join(char(10))
        return globals.text
    end if
    if lineNumber == 0 then
        globals.lines.reverse
        globals.lines.push(subStr)
        globals.lines.reverse
        globals.text = lines.join(char(10))
        return globals.text
    end if
    upLines = lines[:lineNumber - 1]
    downLines = lines[lineNumber - 1:]
    lines = upLines + [subStr] + downLines
    globals.text = lines.join(char(10))
    return globals.text
end function

commands["m"] = {"name":"m", "desc":"Modify a line."}
commands["m"]["run"] = function()
    input = user_input("[Number] [NewText]\n>")
    input = input.split(" ")
    lineNumber = input[0].to_int
    if typeof(lineNumber) != "number" then return user_input("Invalid line number.", false ,true)
    input.pull
    subStr = input.join(" ")
    if lineNumber > lines.len then
        globals.lines.push(subStr)
        globals.text = lines.join(char(10))
        return globals.text
    end if
    if lineNumber <= 0 then return user_input("Invalid line number.", false ,true)
    lines[lineNumber - 1] = subStr
    globals.text = lines.join(char(10))
    return globals.text
end function

commands["c"] = {"name":"c", "desc":"Clear a line."}
commands["c"]["run"] = function()
    input = user_input("[Number]\n>")
    lineNumber = input.to_int
    if typeof(lineNumber) != "number" then return user_input("Invalid line number.", false ,true)
    if lineNumber > lines.len then return user_input("Invalid line number.", false ,true)
    if lineNumber <= 0 then return user_input("Invalid line number.", false ,true)
    globals.lines[lineNumber - 1] = ""
    globals.text = lines.join(char(10))
    return globals.text
end function

commands["r"] = {"name":"r", "desc":"Remove a line."}
commands["r"]["run"] = function()
    input = user_input("[Number]\n>")
    lineNumber = input.to_int
    if typeof(lineNumber) != "number" then return user_input("Invalid line number.", false ,true)
    if lineNumber > lines.len then return user_input("Invalid line number.", false ,true)
    if lineNumber == 0 then return user_input("Invalid line number.", false ,true)
    if lineNumber == lines.len and lines.len == 1 then return user_input("Cannot remove the only line.", false ,true)
    upLines = globals.lines[:lineNumber - 1]
    downLines = globals.lines[lineNumber:]
    globals.lines = upLines + downLines
    globals.text = lines.join(char(10))
    return globals.text
end function

commands["x"] = {"name":"x", "desc":"Save and exit."}
commands["x"]["run"] = function()
    if writeFile then exit("Changes saved. Exiting.") else return user_input("Failed to save.", false ,true)
end function

commands["s"] = {"name":"s", "desc":"Save changes."}
commands["s"]["run"] = function()
    if writeFile then return user_input("Changes saved.", false, true) else return user_input("Failed to save.", false ,true)
end function

commands["q"] = {"name":"q", "desc":"Exit without save."}
commands["q"]["run"] = function()
    exit("Changes not saved. Exiting.")
end function

writeFile = function()
    if globals.file.set_content(globals.text) != 1 then return null else return true
end function

execute = function(input = "")
    if not commands.hasIndex(input) then return user_input("Error: Command not found! Press h for a list of commands.\nPress any key to continue", false, true)
    command = commands[input]
    command.run
end function

main = function()
    globals.computer = get_shell.host_computer
    if params.len > 1 then return print("Usage: vim [(opt)file](Will default to Untitled.txt if no file is specified)")
    if params.len == 0 then
        fileName = "Untitled.txt"
    else
        if params[0] == "-h" or params[0] == "--help" or params.len > 1 then return print("Usage: vim [(opt)file](Will default to Untitled.txt if no file is specified)")
        fileName = params[0]
    end if
    if not computer.File(fileName) then computer.touch(current_path, fileName)
    globals.file = computer.File(fileName)
    globals.text = file.get_content
    while true
        clear_screen
        globals.lines = globals.text.split(char(10))
        if not lines then lines = [""]
        for i in range(0, lines.len - 1)
            print("<color=orange>" + (i + 1) + "<color=white>:</color> " + lines[i])
        end for
        input = user_input("<color=yellow>" + fileName + "></color> ", false, true)
        execute(input.lower)
    end while
end function
main