// mongoose models
// const User = require('../models/user')
const Tvlist = require('../models/tvlist')
const Activity = require('../models/activity')

module.exports.handleActivity = async (activity) => {
  let activity_document
  if (activity.tv_id) {
    activity_document = await Activity.findOne({ tv_id: activity.tv_id, user: activity.user })
    if (activity_document)
      activity_document.desc = activity.desc
    else
      activity_document = new Activity(activity)
  } else {
    activity_document = new Activity(activity)
  }
  activity_document.save()
}