def score_code(code):

    lines = len(code.split("\n"))

    if lines < 10:
        return "Simple Code"

    elif lines < 30:
        return "Intermediate Code"

    else:
        return "Complex Code"