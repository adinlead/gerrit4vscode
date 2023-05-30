import * as vscode from 'vscode'


export function gitAPI(val: string, pushBranch = '', id = 0) {
  const gitExtension = vscode.extensions.getExtension('vscode.git')
  const git = gitExtension?.exports
  const api = git.getAPI(1)
  if (val === 'push') {
    const repo = api.repositories[id]
    repo.push('origin', `HEAD:refs/for/${pushBranch}`)
      .catch((err: any) => {
        vscode.window.showErrorMessage(err.stderr)
      })
    return repo
  } else if (val === 'repos') {
    const repo = api.repositories
    return repo
  } else if(val === 'current') {
    const repo = api.repositories[0]
    const head = repo.repository.HEAD
    let remote: string | undefined
    let branch: string | undefined

    if (head && head.name && head.upstream) {
      remote = head.upstream.remote
      branch = `${head.upstream.name}`
    }

    return repo.repository.pullFrom(true, remote, branch, false)
  }
}
