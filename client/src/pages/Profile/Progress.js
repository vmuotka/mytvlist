import React, { useState } from 'react'

// project components
import { Table, Thead, Tbody } from '../../components/Table'
import ProgressTableRow from './ProgressTableRow'
import Modal from '../../components/Modal/'
import InputField from '../../components/InputField'
import Button from '../../components/Button'

const Progress = ({ profile, setProfile }) => {
  const [modal, setModal] = useState({
    hidden: true, show: {
      "progress": [
        {
          "season": 5,
          "episode": 15
        }
      ],
      "user": "5f87b03c842e500d044853ff",
      "tv_id": 4313,
      "following": true,
      "createdAt": "2020-10-15T02:34:07.184Z",
      "updatedAt": "2020-10-15T02:34:07.184Z",
      "__v": 0,
      "id": "5f87b51f842e500d04485432",
      "tv_info": {
        "backdrop_path": "/cYkDRU5eJSTGfvcFYRyeJgKMuwU.jpg",
        "created_by": [
          {
            "id": 60621,
            "credit_id": "5851b5e19251416fad01a652",
            "name": "Jeff Franklin",
            "gender": 2,
            "profile_path": "/7oPqgDS1YCNSneqg2DlkquywEJE.jpg"
          }
        ],
        "episode_run_time": [
          25
        ],
        "first_air_date": "1987-09-22",
        "genres": [
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 10751,
            "name": "Family"
          }
        ],
        "homepage": "",
        "id": 4313,
        "in_production": false,
        "languages": [
          "en"
        ],
        "last_air_date": "1995-05-23",
        "last_episode_to_air": {
          "air_date": "1995-05-23",
          "episode_number": 24,
          "id": 297442,
          "name": "Michelle Rides Again (2)",
          "overview": "Teaser: in syndication, there would be a recap of part 1.   Main Synopsis: Michelle is rushed to the hospital, where Danny realizes that the reason why Michelle was on the horse trail with Elizabeth was because Michelle didn't want to compete because Danny put too much pressure on her to beat Elizabeth. Everyone is relieved when a doctor tells them that Michelle is out of Danger, but Michelle did take a hard hit on the head, so the doctor has decided to keep Michelle in the hospital overnight for observation. The doctor takes Danny, Jesse, and Joey to the room Michelle is in, and Michelle doesn't know who they are. The doctor explains that memory loss is common with head injuries, and it's usually temporary. At home, on the day Michelle is scheduled to be released from the hospital, Andrew comes back over, and explains that the reason why he's been reluctant to kiss Stephanie is because he didn't know how Stephanie would feel about it, but after what Michelle said a few days ago, Andre",
          "production_code": "",
          "season_number": 8,
          "show_id": 4313,
          "still_path": "/7DpAvm9xeI9OCmB0xxSlgzmnmWN.jpg",
          "vote_average": 0,
          "vote_count": 0
        },
        "name": "Full House",
        "next_episode_to_air": null,
        "networks": [
          {
            "name": "ABC",
            "id": 2,
            "logo_path": "/ndAvF4JLsliGreX87jAc9GdjmJY.png",
            "origin_country": "US"
          }
        ],
        "number_of_episodes": 192,
        "number_of_seasons": 8,
        "origin_country": [
          "US"
        ],
        "original_language": "en",
        "original_name": "Full House",
        "overview": "After the death of his wife, Danny enlists his best friend and his brother-in-law to help raise his three daughters, D.J., Stephanie, and Michelle.",
        "popularity": 46.753,
        "poster_path": "/n1zDvKUfDp9yLRnvZ9wGUuud8r0.jpg",
        "production_companies": [
          {
            "id": 56605,
            "logo_path": null,
            "name": "Miller/Boyett Productions",
            "origin_country": ""
          },
          {
            "id": 23564,
            "logo_path": null,
            "name": "Jeff Franklin Productions",
            "origin_country": ""
          },
          {
            "id": 1193,
            "logo_path": "/ctXTFMt91z96WMbMOlW0Morgwny.png",
            "name": "Lorimar Television",
            "origin_country": "US"
          },
          {
            "id": 1957,
            "logo_path": "/3T19XSr6yqaLNK8uJWFImPgRax0.png",
            "name": "Warner Bros. Television",
            "origin_country": "US"
          }
        ],
        "seasons": [
          {
            "air_date": "1987-09-22",
            "episode_count": 22,
            "id": 12718,
            "name": "Season 1",
            "overview": "The first season of the family sitcom Full House originally aired on ABC from September 22, 1987 to May 6, 1988.",
            "poster_path": "/62X8zmUNowcZfxS2yUUWdhK9iaf.jpg",
            "season_number": 1
          },
          {
            "air_date": "1988-10-14",
            "episode_count": 22,
            "id": 12721,
            "name": "Season 2",
            "overview": "Season Two of the family sitcom Full House originally aired on ABC between October 14, 1988 and May 5, 1989. From this season onward, Mary-Kate and Ashley Olsen are credited in the opening credits.",
            "poster_path": "/prm07DoL36a5UZA2XlHX9OuI19D.jpg",
            "season_number": 2
          },
          {
            "air_date": "1989-09-22",
            "episode_count": 24,
            "id": 12723,
            "name": "Season 3",
            "overview": "Season three of the family sitcom Full House originally aired on ABC between September 22, 1989 and May 4, 1990.",
            "poster_path": "/jA6d41pRiHcI78NG93ENdMYPexv.jpg",
            "season_number": 3
          },
          {
            "air_date": "1990-09-21",
            "episode_count": 26,
            "id": 12717,
            "name": "Season 4",
            "overview": "Season four of the family sitcom Full House originally aired on ABC from September 21, 1990 to May 3, 1991.",
            "poster_path": "/7wELdh4L3bsVlhC4RTLR7NXKnCK.jpg",
            "season_number": 4
          },
          {
            "air_date": "1991-09-17",
            "episode_count": 26,
            "id": 12720,
            "name": "Season 5",
            "overview": "Season five of the family sitcom Full House originally aired between September 17, 1991 and May 12, 1992 on ABC.",
            "poster_path": "/jlBDwZkezgeE5aQNbgHYitkLQXT.jpg",
            "season_number": 5
          },
          {
            "air_date": "1992-09-22",
            "episode_count": 24,
            "id": 12722,
            "name": "Season 6",
            "overview": "Season six of the family sitcom Full House originally aired on ABC between September 22, 1992 and May 18, 1993.",
            "poster_path": "/k4FYuIIhWVEuEyqm5C4jxcG7Sbb.jpg",
            "season_number": 6
          },
          {
            "air_date": "1993-09-14",
            "episode_count": 24,
            "id": 12716,
            "name": "Season 7",
            "overview": "Season seven of the family sitcom Full House originally aired on ABC between September 14, 1993 and May 17, 1994.",
            "poster_path": "/t4sgHhLKxTuXZNCoan0YNKklARu.jpg",
            "season_number": 7
          },
          {
            "air_date": "1994-09-27",
            "episode_count": 24,
            "id": 12719,
            "name": "Season 8",
            "overview": "The eighth and final season of the ABC family sitcom Full House originally aired between September 27, 1994 and May 23, 1995.",
            "poster_path": "/8jfxVwYSyV290VDxYRhKKTI96sE.jpg",
            "season_number": 8
          }
        ],
        "status": "Ended",
        "type": "Scripted",
        "vote_average": 7.2,
        "vote_count": 439,
        "following": true
      }
    }
  })

  const handleModal = (show) => e => {
    if (show === undefined) {
      setModal({
        ...modal,
        hidden: !modal.hidden
      })
    } else {
      setModal({
        hidden: !modal.hidden,
        show
      })
    }
  }

  console.log(modal.show)

  return (
    <div>
      <p className='text-gray-600 text-lg ml-2 mb-2'>Watching ({profile.tvlist && profile.tvlist.length} shows)</p>
      <Table headers={['Show', 'Season', 'Episode']}>
        <Thead headers={['Show', 'Season', 'Episode']} />
        <Tbody>
          {profile.tvlist && profile.tvlist.map(show =>
            <ProgressTableRow handleModal={handleModal} key={show.id} show={show} profile={profile} setProfile={setProfile} />
          )}
        </Tbody>
      </Table>
      {modal.show &&
        <Modal hidden={modal.hidden} title={modal.show.tv_info.name} closeFunction={handleModal}>
          <tbody className='text-center'>
            <tr>
              <td colspan='2'>
                <img src={`https://image.tmdb.org/t/p/w400${modal.show.tv_info.poster_path}`} alt='Show Poster' />
              </td>
              <td colspan='2' className='p-4'>
                <div className='inline-block mb-2 md:mr-2'>
                  <InputField type='number' name='season' label='Season' size='5' value={modal.show.progress[0].season} className='text-center inline' />
                </div>
                <div className='inline-block mb-2 md:ml-2'>
                  <InputField type='number' name='episode' label='Episode' size='5' value={modal.show.progress[0].episode} className='text-center inline' />
                </div>
                <Button className='block m-auto mt-2' color='bg-green-500 hover:bg-green-600'>Save</Button>
              </td>
            </tr>
          </tbody>
        </Modal>
      }
    </div>
  )
}

export default Progress