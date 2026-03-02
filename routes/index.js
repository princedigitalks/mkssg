import { createWebHistory, createRouter } from 'vue-router'
import PublicLayout from '../src/components/PublicLayout.vue'
import UserLayout from '../src/components/UserLayout.vue'
import Home from '../src/components/public/Home.vue'
import TermsAndConditions from '../src/components/public/Terms.vue'
import PrivacyPolicy from '../src/components/public/PrivacyPolicy.vue'
import Contact from '../src/components/public/Contact.vue';
import Stars from '../src/components/public/Stars.vue';
import Version from '../src/components/public/Version.vue';
import Login from '../src/components/public/Login.vue';
import Feed from './../src/components/user/feed.vue';
import Search from './../src/components/user/Search.vue';
import SearchResults from './../src/components/user/SearchResults.vue';
import EmptySearchResults from './../src/components/user/EmptySearchResults.vue';
import ViewProfile from './../src/components/user/ViewProfile.vue';
import ProfileInfo from '@/components/user/ProfileInfo.vue';
import ProfileFamily from '@/components/user/ProfileFamily.vue';
import ProfileEducation from '@/components/user/ProfileEducation.vue';
import ProfileWork from '@/components/user/ProfileWork.vue';
import ProfileHobbies from '@/components/user/ProfileHobbies.vue';
import ProfileDonations from '@/components/user/ProfileDonations.vue';
import EditProfile from '@/components/user/EditProfile.vue';
import EditProfileImages from '@/components/user/EditProfileImages.vue';
import EditProfileInfo from '@/components/user/EditProfileInfo.vue';
import EditProfileEducation from '@/components/user/EditProfileEducation.vue';
import EditProfileWork from '@/components/user/EditProfileWork.vue';
import EditProfileHobbies from '@/components/user/EditProfileHobbies.vue';
import EditProfileSocials from '@/components/user/EditProfileSocials.vue';
import Profiles from '@/components/user/Profiles.vue';
import SubmitBio from '@/components/user/SubmitBio.vue';
import UploadBio from '@/components/user/UploadBio.vue';
import MyMatrimonyListings from '@/components/user/MyMatrimonyListings.vue';
import ViewMatrimonyListing from '@/components/user/ViewMatrimonyListing.vue';
import SearchMatrimonyListing from '@/components/user/SearchMatrimonyListing.vue';
import SearchMatrimonyListingResults from '@/components/user/SearchMatrimonyListingResults.vue';
import ViewPage from '@/components/user/ViewPage.vue';
import ViewPagePosts from '@/components/user/ViewPagePosts.vue';
import ViewPageInfo from '@/components/user/ViewPageInfo.vue';
import NewPagePost from '@/components/user/NewPagePost.vue';
import Payments from '@/components/user/Payments.vue';

const routes = [
	{
		path: '/',
		component: PublicLayout,
		children : [
			{
				path: '/',
				name: 'Home',
				component: Home,
			},
			{
				path: '/login',
				name: 'Login',
				component: Login,
			},
			{
				path: '/contact',
				name: 'Contact',
				component: Contact,
			},
			{
				path: '/bright-stars',
				name: 'Stars',
				component: Stars,
			},
			{
				path: '/version',
				name: 'Version',
				component: Version,
			},
			{
				path: '/terms-and-conditions',
				name: 'TermsAndConditions',
				component: TermsAndConditions,
			},
			{
				path: '/privacy-policy',
				name: 'PrivacyPolicy',
				component: PrivacyPolicy,
			}
		]
	},
	
	{
		path: '/feed',
		name:'feed',
		component: UserLayout,
		children : [
			{
				path: '/terms-and-conditions-lg',
				name: 'TermsAndConditionsLg',
				component: TermsAndConditions,
			},
			{
				path: '/privacy-policy-lg',
				name: 'PrivacyPolicyLg',
				component: PrivacyPolicy,
			},
			{
				path: '/feed',
				name: 'timeline',
				component: Feed,
			},
			{
				path: '/user-contact',
				name: 'UserContact',
				component: Contact,
			},
			{
				path: '/user-bright-stars',
				name: 'UserStars',
				component: Stars,
			},
			{
				path: '/app-version',
				name: 'AppVersion',
				component: Version,
			},
			{
				path: '/search',
				name: 'search',
				component: Search,
			},
			{
				path: '/search-results',
				name: 'EmptySearchResults',
				component: EmptySearchResults,
			},
			{
				path: '/search-results/:searchdata',
				name: 'SearchResults',
				component: SearchResults,
			},
			{
				path: '/profiles',
				name: 'Profiles',
				component: Profiles,
			},
			{
				path: '/profile/:id',
				name: 'profile',
				component: ViewProfile,
				children : [
					{
						path: '/profile/:id',
						name: 'ProfileInfo',
						component: ProfileInfo,
					},
					{
						path: '/profile/family/:id',
						name: 'ProfileFamily',
						component: ProfileFamily,
					},
					{
						path: '/profile/education/:id',
						name: 'ProfileEducation',
						component: ProfileEducation,
					},
					{
						path: '/profile/work/:id',
						name: 'ProfileWork',
						component: ProfileWork,
					},
					{
						path: '/profile/hobbies/:id',
						name: 'ProfileHobbies',
						component: ProfileHobbies,
					},
					{
						path: '/profile/donations/:id',
						name: 'ProfileDonations',
						component: ProfileDonations,
					}
				]
			},
			{
				path: '/edit-profile/:id',
				name: 'EditProfile',
				component: EditProfile,
			},
			{
				path: '/edit-profile/images/:id',
				name: 'EditProfileImages',
				component: EditProfileImages,
			},
			{
				path: '/edit-profile/info/:id',
				name: 'EditProfileInfo',
				component: EditProfileInfo,
			},
			{
				path: '/edit-profile/education/:id',
				name: 'EditProfileEducation',
				component: EditProfileEducation,
			},
			{
				path: '/edit-profile/work/:id',
				name: 'EditProfileWork',
				component: EditProfileWork,
			},
			{
				path: '/edit-profile/hobbies/:id',
				name: 'EditProfileHobbies',
				component: EditProfileHobbies,
			},
			{
				path: '/edit-profile/socials/:id',
				name: 'EditProfileSocials',
				component: EditProfileSocials,
			},
			{
				path: '/submit-bio',
				name: 'SubmitBio',
				component: SubmitBio,
			},
			{
				path: '/upload-bio/:id',
				name: 'UploadBio',
				component: UploadBio,
			},
			{
				path: '/matrimony-listings',
				name: 'MyMatrimonyListings',
				component: MyMatrimonyListings,
			},
			{
				path: '/matrimony-listings/view/:id',
				name: 'ViewMatrimonyListing',
				component: ViewMatrimonyListing,
			},
			{
				path: '/search-listings',
				name: 'SearchMatrimonyListing',
				component: SearchMatrimonyListing,
			},
			{
				path: '/search-listings/:search',
				name: 'SearchMatrimonyListingResults',
				component: SearchMatrimonyListingResults,
			},
			{
				path: '/page/:slug',
				name: 'ViewPage',
				component: ViewPage,
				children:[
					{
						path: '/page/:slug',
						name: 'ViewPagePosts',
						component: ViewPagePosts,
					},
					{
						path: '/page/info/:slug',
						name: 'ViewPageInfo',
						component: ViewPageInfo,
					}
				]
			},
			{
				path: '/payments',
				name: 'Payments',
				component: Payments,
			},
			{
				path: '/page/new-post/:slug',
				name: 'NewPagePost',
				component: NewPagePost,
			}
		]
	}
	
	
]
const router = createRouter({
	history: createWebHistory(),
	routes, //same --- > routes:routes
})
export default router