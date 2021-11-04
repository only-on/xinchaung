export class UploadStatus {
  protected PREPARED = 'prepared'
  protected DETECTING = 'detecting'
  protected DETECTING_FAILED = 'detectingFailed'
  protected PAUSED = 'paused'
  protected UPLOADING = 'uploading'
  protected UPLOAD_FAILED = 'uploadFailed'
  protected UPLOADED = 'uploaded'
  protected DELETED = 'deleted'
  protected DELETED_FAILED = 'deletedFailed'
  private state = ''

  get isPrepared() {
    return this.state === this.PREPARED
  }
  get isDetecting() {
    return this.state === this.DETECTING
  }
  get isDetectingFailed() {
    return this.state === this.DETECTING_FAILED
  }
  get isPaused() {
    return this.state === this.PAUSED
  }
  get isUploading() {
    return this.state === this.UPLOADING
  }
  get isUploadFailed() {
    return this.state === this.UPLOAD_FAILED
  }
  get isUploaded() {
    return this.state === this.UPLOADED
  }
  get isDeleted() {
    return this.state === this.DELETED
  }
  get isDeletedFailed() {
    return this.state === this.DELETED_FAILED
  }

  public prepared() {
    this.state = this.PREPARED
  }
  public detecting() {
    this.state = this.DETECTING
  }
  public detectingFailed() {
    this.state = this.DETECTING_FAILED
  }
  public paused() {
    this.state = this.PAUSED
  }
  public uploading() {
    this.state = this.UPLOADING
  }
  public uploadFailed() {
    this.state = this.UPLOAD_FAILED
  }
  public uploaded() {
    this.state = this.UPLOADED
  }
  public deleted() {
    this.state = this.DELETED
  }
  public deletedFailed() {
    this.state = this.DELETED_FAILED
  }
}
