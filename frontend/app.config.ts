export default defineAppConfig({
  ui: {
    stepper: {
			slots:{
				trigger: 'group-data-[state=active]:text-primary'
			},
			variants: {
				color: {
					neutral:{
						trigger: 'group-data-[state=active]:bg-elevated group-data-[state=active]:outline-2 group-data-[state=active]:outline-offset-2 group-data-[state=active]:outline-bg-elevated' ,
					} 
				}
			}
		},
		card: {
			variants: {
				variant: {
				soft: {
					root: 'bg-accented'
				},
			}
			}
		},
		avatar: {
			 slots: {
        root:'bg-accented'
			}
		}
	}
})