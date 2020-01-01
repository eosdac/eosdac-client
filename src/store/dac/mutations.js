// dac store
export function setIsLoaded (state, payload) {
  state.isLoaded = payload
}

export function setMemberTerms (state, memberterms) {
  memberterms = memberterms.rows.sort(function (a, b) {
    return a.version - b.version
  })

  state.memberTerms = memberterms
}

export function setTokenStats (state, payload) {
  state.tokenStats = payload
}

export function setCustodians (state, payload) {
  state.custodians = payload
}

export function setCustodianPermissions (state, payload) {
  state.custodianPermissions = payload
}

export function setDacAdmins (state, payload) {
  state.dacAdmins = payload
}

export function setCustodianConfig (state, payload) {
  state.custodianConfig = payload
}

export function setWpConfig (state, payload) {
  state.wpConfig = payload
}

export function setTokenConfig (state, payload) {
  state.tokenConfig = payload
}

export function setReferendumConfig (state, payload) {
  state.referendumConfig = payload
}

export function setCandidates (state, payload) {
  state.candidates = payload
}

export function setCandidateVote (state, payload) {
  let candidateName = payload.candidate_name
  let voteAmount = payload.total_votes
  if (state.candidates) {
    let cand = state.candidates.find(c => c.candidate_name === candidateName)
    cand.total_votes = voteAmount
  }
}

export function setCustodianState (state, payload) {
  state.custodianState = payload
}
