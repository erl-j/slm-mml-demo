export const taskMeta = {
    "generate": {
        "title": "Unconstrained generation",
        "description": "Generate a loop from scratch.",
        "temperature": "0.85",
        "parameters": "top-p=0.75, T=200."
    },
    "pitch_set": {
        "title": "Replace pitch",
        "description": "Regenerate all the pitches of the loop, restricting the pitches to the set of pitches in the natural reference loop.",
        "parameters": "top-p=0.85, T=300."
    },
    "constrained_generation": {
        "title": "Constrained generation",
        "description": "We restrict the generation to only use instruments and note onset beats present in the natural reference loop.",
        "temperature": "0.85",
        "parameters": "top-p=0.99, T=300."
    },
    "variation": {
        "title": "Variation",
        "description": "Generate a variation of the loop. We do this by taking our source loop, turning it into a one-hot-like probability distribution, and mixing it with a uniform prior.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_high_patched": {
        "title": "Replace upper half",
        "description": "Regenerate the upper half of the pitch range, drums are kept the same.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_low": {
        "title": "Replace lower half",
        "description": "Regenerate the lower half of the pitch range, drums are kept the same.",
        "parameters": "top-p=0.5, T=200.",
        "temperature": "1.0",
    },
    "infilling_box_middle": {
        "title": "Replace box",
        "description": "Regenerate upper half of the pitch range for bars 2 and 3, drums are kept the same.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_middle": {
        "title": "Infill middle",
        "description": "Regenerate bars 2 and 3 of the natural reference loop.",
        "parameters": "top-p=0.75, T=300."
    },
    "replace_bass": {
        "title": "Replace bass",
        "description": "Replace the bass of the loop.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_drums": {
        "title": "Replace drums",
        "description": "Replace the drums of the loop.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_start": {
        "title": "Replace first half",
        "description": "Regenerate the first half of the loop.",
        "parameters": "top-p=0.75, T=300."
    },
    "infilling_end": {
        "title": "Replace second half",
        "description": "Regenerate the second half of the loop.",
        "parameters": "top-p=0.75, T=300."
    },
}

export const tasks = [
    "generate",
    "constrained_generation",
    "infilling_start",
    "infilling_end",
    "infilling_low",
    "infilling_high_patched",
    "infilling_box_middle",
    "pitch_set",
]

// The prior allows between 3 and 13 drum notes to be added to the loop, where 3 have to be any of the tom pitches and the rest can be any drum pitch.
// Also notice that we do not specify the exact onset / beat for the tom notes, rather we let the model decide where to place drum notes within the specified range.
// We also emphasize that this is just one interpretation of a tom fill, and different users might want to create different rules to suit their preferences.
export const codePriors = {
    "Add tom fill":
    {
        caption: "This rule allows between 3 and 13 drum notes to be added to the loop, where 3 have to be any of the tom pitches and the rest can be any drum pitch. Also notice that we do not specify the exact onset/beat for the tom notes, rather we let the model decide where to place drum notes within the specified range. We also emphasize that this is just one interpretation of a tom fill, and different users might want to create different rules to suit their preferences.",
        code :
    `def add_tom_fill_prior(e):
    '''
    Add a tom fill to the loop.
    input: e: list of EventConstraints
    output: e: list of EventConstraints
    '''

    # define tom pitches
    TOM_PITCHES = {f"{pitch} (Drums)" for pitch in ["48", "50", "45", "47"]}

    # remove inactive notes
    e = [ev for ev in e if ev.is_active()]

    # remove drums in last 2 beats
    e = [
      ev
      for ev in e
      if not(
        not ev.a["onset/beat"].isdisjoint({ "14", "15"})
        and not ev.a["instrument"].isdisjoint({ "Drums"})
      )
    ]
    # add 3 toms from any of the tom pitches.
    e += [
      EventConstraint()
        .intersect(
          {
            "instrument": { "Drums"},
            "pitch": TOM_PITCHES,
            "onset/beat": { "14", "15", "_"},
          }
        )
        .force_active()
      for e in range(3)
    ]
    # add up to 10 more drums in last two beats
    e += [
      EventConstraint().intersect(
        { "instrument": { "Drums"}, "onset/beat": { "14", "15", "_"} }
      )
      for _ in range(10)
    ]
    # pad with inactive notes
    e += [EventConstraint().force_inactive() for _ in range(N_EVENTS - len(e))]
    return e
    
event_constraints = midi2event_constraints(request.midi)
new_event_constraints = add_tom_fill_prior(event_constraints)
prior = event_constraints2prior(new_event_constraints)
new_midi = slm_model.generate(prior)
    `},


    "Add a locked in bassline":
    {  caption: "This rule adds a bass note with unspecified pitch and velocity everywhere a kick drum occurs and adds up to 5 more bass notes anywhere in the loop.",
        code:
    `def add_locked_in_bassline(e):
    '''
    Add locked to the loop.
    input: e: list of EventConstraints
    output: e: list of EventConstraints
    '''
    # remove inactive notes
    e = [ev for ev in e if ev.is_active()]
    
    # remove bass
    e = [ev for ev in e if ev.a["instrument"].isdisjoint({ "Bass"})]
    
    # find kicks
    kicks =[
      ev
        for ev in e
        if { "35 (Drums)", "36 (Drums)", "37 (Drums)"}.intersection(ev.a["pitch"])
    ]
    
    # add bass note on every kick
    for kick in kicks:
    e += [
        EventConstraint()
        .intersect(
            {
            "instrument": { "Bass"},
            "onset/beat": kick.a["onset/beat"],
            "onset/tick": kick.a["onset/tick"],
            }
        )
        .force_active()
    ]
    
    # add up to 5 more bass notes
    e += [EventConstraint().intersect({ "instrument": { "Bass"} }) for _ in range(5)]
    
    # pad with empty notes
    e += [EventConstraint().force_inactive() for _ in range(N_EVENTS - len(e))]
    return e

event_constraints = midi2event_constraints(request.midi)
new_event_constraints = add_locked_in_bassline(event_constraints)
prior = event_constraints2prior(new_event_constraints)
new_midi = slm_model.generate(prior)
    `},

    'Drum beat with dynamic hats and snare ghost notes': {
        caption: "This rule requests 10 kicks, 4 snares, 10 hihats, 4 open hihats, and 10 ghost snare notes (low velocity snare hits). It also allows up to 20 optional drum notes to be added. The tempo is set to 96 and the style tag is set to 'funk'.",
        code:
    `def dynamic_drum_beat():
    '''
    input: e: list of EventConstraints
    output: e: list of EventConstraints
    '''
    e =[]

    # add 10 kicks
    e +=[
    EventConstraint().intersect({ "pitch": { "36 (Drums)"} }).force_active()
        for _ in range(20)
    ]

    # add 4 snares
    e += [
    EventConstraint().intersect({ "pitch": { "38 (Drums)"} }).force_active()
            for _ in range(4)
        ]

    # add 10 hihats
    e += [
    EventConstraint().intersect({ "pitch": { "42 (Drums)"} }).force_active()
            for _ in range(40)
        ]

    # add 4 open
    e += [
    EventConstraint().intersect({ "pitch": { "46 (Drums)"} }).force_active()
            for _ in range(4)
        ]

    # add 10 ghost snare
    e += [
    EventConstraint().intersect({ "pitch": { "38 (Drums)"} }).intersect(velocity_constraint(40)).force_active()
            for _ in range(10)
        ]

    # add up to 20 optional drum notes
    e += [EventConstraint().intersect({ "instrument": { "Drums"} }) for _ in range(20)]

    # pad with empty notes
    e += [EventConstraint().force_inactive() for _ in range(N_EVENTS - len(e))]

    # set tempo to 96 or "-"
    e = [ev.intersect({"96","-}) for ev in e]

    # set tag to funk or "-"
    e = [ev.intersect({ "tag": { "funk", "-"} }) for ev in e]
    return e

# note that this rule does not require any input, as it used to generate a new loop from scratch.
new_event_constraints = dynamic_drum_beat()
prior = event_constraints2prior(new_event_constraints)
new_midi = slm_model.generate(prior)
    `},

    "Repitch selection":{
        "caption":"This rule removes the pitch information from the notes in the selected area. The notes are then repitched to any pitch in the pitch range of the selected area.",
        "code":
    `def repitch_prior(e, beat_range, pitch_range, is_drums):
    '''
    input: e: list of EventConstraints
    beat_range: tuple of ints (start, end) representing the time range of the selected area.
    pitch_range: tuple of ints (min_pitch, max_pitch) representing the pitch range of the selected area.
    is_drums: bool representing whether the selected area is drums or not.
    output: e: list of EventConstraints
    '''

    # remove empty events
    e = [ev for ev in e if not ev.is_inactive()]
    beats = set([str(r) for r in range(beat_range[0], beat_range[1])])
    pitches = set(
        [
            f"{str(r)}{' (Drums)' if is_drums else ''}"
            for r in range(pitch_range[0], pitch_range[1])
        ]
    )

    # if in beat range and pitch range, repitch to any pitch in pitch range
    for i in range(len(e)):
        if e[i].a["onset/beat"].issubset(beats) and e[i].a["pitch"].issubset(pitches):
            e[i].a["pitch"] = pitches

    # pad with empty notes
    e += [EventConstraint().force_inactive() for e in range(N_EVENTS - len(e))]
    return e

# note that this rule does not require any input, as it used to generate a new loop from scratch.
event_constraints = midi2event_constraints(request.midi)
new_event_constraints = repitch_prior(event_constraints, request.selection_area.beat_range, request.selection_area.pitch_range, request.selection_area.is_drums)
prior = event_constraints2prior(newevent_constraints)
new_midi = slm_model.generate(prior)
    `}
}