'use client'

import { ModeToggle } from "@/components/mode-toggle"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Fragment, JSX, useEffect, useState } from "react"
import { schedules, programs } from './data.json'

type Course = {
	code: string
	name: string
	designation: string
	designator: string
	periods: TimePeriod[]
	program?: string
}

type TimePeriod = {
	start: number
	end: number
	days: number[]
}

export default function Schedule() {
	const [filterType, setFilterType] = useState<"block" | "venue" | "instructor">("block")
	const [filterValue, setFilterValue] = useState<string | undefined>("")
	const [filteredData, setFilteredData] = useState<Course[] | undefined>(undefined)

	useEffect(() => {
		setFilterValue(undefined)
		setFilteredData(undefined)
	}, [filterType])

	useEffect(() => {
		if (!filterValue) return;

		switch (filterType) {
			case 'block':
				if (
					!filterValue ||
					!Object.prototype.hasOwnProperty.call(schedules, filterValue)
				) return setFilteredData(undefined);
				setFilteredData(schedules[filterValue as keyof typeof schedules].map(
					(course) => ({
						...course,
						designator: course.instructor,
						name: programs[filterValue.split('-')[0] as keyof typeof programs].find(p => p.code === course.code)?.name || 'Course Name Not Found'
					})
				));
				break;
			case 'venue':
				const venueFilteredData = Object.entries(schedules)
					.flatMap(([blockName, courses]) =>
						courses.filter(course => course.designation.toLowerCase().includes(filterValue.toLowerCase()))
							.map(course => ({
								...course,
								designation: blockName,
								designator: course.instructor,
								name: programs[blockName.split('-')[0] as keyof typeof programs].find(p => p.code === course.code)?.name || 'Course Name Not Found'
							}))
					);

				setFilteredData(venueFilteredData.length > 0 ? venueFilteredData : undefined);
				break;
			case 'instructor':
				const instructorFilteredData = Object.entries(schedules)
					.flatMap(([blockName, courses]) =>
						courses.filter(course => course.instructor.toLowerCase().includes(filterValue.toLowerCase()))
							.map(course => ({
								...course,
								designator: blockName,
								name: programs[blockName.split('-')[0] as keyof typeof programs].find(p => p.code === course.code)?.name || 'Course Name Not Found'
							}))
					);

				setFilteredData(instructorFilteredData.length > 0 ? instructorFilteredData : undefined);
				break;
		}
	}, [filterType, filterValue])
	return (
		<>
			<div className="border bg-card rounded-lg w-full max-w-full sm:max-w-xl p-2 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[auto_1fr] grid-rows-[auto_auto] sm:grid-rows-1 gap-2">
				<Select value={filterType} onValueChange={(value) => setFilterType(value as "block" | "venue" | "instructor")}>
					<SelectTrigger className="col-span-2 sm:col-span-1 w-full sm:w-36 dark:bg-input/30">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Filter By</SelectLabel>
							<SelectItem value="block">Block</SelectItem>
							<SelectItem value="venue">Venue</SelectItem>
							<SelectItem value="instructor">Instructor</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div className="col-span-2 sm:col-span-1 grid grid-rows-1 grid-cols-subgrid sm:grid-cols-[1fr_auto] gap-2">
					{
						filterType === "block" && (
							<Select value={filterValue} onValueChange={setFilterValue}>
								<SelectTrigger className="w-full sm:w-64 dark:bg-input/30 sm:mr-auto">
									<SelectValue className="truncate" placeholder="Select Block" />
								</SelectTrigger>
								<SelectContent className="px-0 max-w-[var(--radix-select-trigger-width)]">
									{(() => {
										const programs = Array.from(new Set(Object.keys(schedules).map((blockName) => blockName.split("-")[0])))
										return programs.map((program) => {
											const programBlocks = Object.keys(schedules)
												.filter((block) => block.startsWith(program))
												.sort()
											const yearLevels = Array.from(new Set(programBlocks.map((block) => block.split("-")[1][0]))).sort()

											return yearLevels.map((yearLevel) => {
												const blocksForYear = programBlocks.filter((block) => block.startsWith(`${program}-${yearLevel}`))
												return (
													<Fragment key={`${program}-${yearLevel}`}>
														<SelectGroup>
															<SelectLabel key={yearLevel}>
																{program}
																{' '}
																{
																	yearLevel === "1" ? "Freshman (1st Year)" :
																		yearLevel === "2" ? "Sophomore (2nd Year)" :
																			yearLevel === "3" ? "Junior (3rd Year)" :
																				yearLevel === "4" ? "Senior (4th Year)" :
																					yearLevel === "5" ? "Super Senior (5th Year)" :
																						`Year ${yearLevel}`
																}
															</SelectLabel>
															{blocksForYear.map((block) => (
																<SelectItem key={block} value={block}>
																	{block}
																</SelectItem>
															))}
														</SelectGroup>
														{
															yearLevels.indexOf(yearLevel) == yearLevels.length - 1 &&
																programs.indexOf(program) != programs.length - 1
																?
																<Separator /> :
																null
														}
													</Fragment>
												)
											})
										})
									})()}
								</SelectContent>
							</Select>
						)
					}
					{
						filterType === "venue" && (
							<Select value={filterValue} onValueChange={setFilterValue}>
								<SelectTrigger className="w-full sm:w-64 dark:bg-input/30 sm:mr-auto">
									<SelectValue className="truncate" placeholder="Search Venue" />
								</SelectTrigger>
								<SelectContent className="px-0 max-w-[var(--radix-select-trigger-width)]">
									<SelectGroup>
										{(() => {
											const allVenues = Array.from(new Set(
												Object.values(schedules).flatMap(courses => courses.map(course => course.designation))
											));

											// Group venues
											// Group venues: rooms by floor, then labs, then others, each as { name, venues }
											const roomVenues = allVenues.filter(v => /^Room \d{3}$/.test(v));
											const labs = allVenues.filter(v => /lab/i.test(v));
											const others = allVenues.filter(v => !roomVenues.includes(v) && !labs.includes(v));

											// Group rooms by floor
											const floorGroups: Record<string, string[]> = {};
											roomVenues.forEach(room => {
												const match = room.match(/^Room (\d)(\d{2})$/);
												if (match) {
													const floor = match[1];
													if (!floorGroups[floor]) floorGroups[floor] = [];
													floorGroups[floor].push(room);
												}
											});

											// Sort rooms within each floor
											Object.values(floorGroups).forEach(rooms => rooms.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })));

											// Sort floors numerically
											const sortedFloors = Object.keys(floorGroups).sort((a, b) => Number(a) - Number(b));

											// Sort labs and others
											labs.sort();
											others.sort();

											// Prepare grouped venues as { name, venues }
											const groupedVenues: { name: string, venues: string[] }[] = [
												...sortedFloors.map(floor => ({
													name: `Room - ${floor}F`,
													venues: floorGroups[floor]
												})),
												labs.length > 0 ? { name: "Labs", venues: labs } : null,
												others.length > 0 ? { name: "Others", venues: others } : null
											].filter(Boolean) as { name: string, venues: string[] }[];

											// Render grouped venues
											return groupedVenues.map(group => (
												<SelectGroup key={group.name}>
													<SelectLabel>{group.name}</SelectLabel>
													{group.venues.map(venue => (
														<SelectItem key={venue} value={venue}>
															{venue}
														</SelectItem>
													))}
												</SelectGroup>
											));
										})()}
									</SelectGroup>
								</SelectContent>
							</Select>
						)
					}
					{
						filterType === "instructor" && (
							<Select value={filterValue} onValueChange={setFilterValue}>
								<SelectTrigger className="w-full sm:w-64 dark:bg-input/30 sm:mr-auto">
									<SelectValue className="truncate" placeholder="Search Instructor" />
								</SelectTrigger>
								<SelectContent className="px-0 max-w-[var(--radix-select-trigger-width)]">
									<SelectGroup>
										{(() => {
											const allInstructors = Array.from(new Set(
												Object.values(schedules).flatMap(courses => courses.map(course => course.instructor))
											)).sort();

											return allInstructors.map(instructor => (
												<SelectItem key={instructor} value={instructor}>
													{instructor}
												</SelectItem>
											));
										})()}
									</SelectGroup>
								</SelectContent>
							</Select>
						)
					}
					<ModeToggle />
				</div>
			</div>
			{
				filteredData == undefined ?
					<div className="border bg-destructive dark:bg-destructive/60 text-white py-3 px-5 w-full max-w-xl rounded-lg text-center">
						Set a filter to view the schedule.
					</div>
					:
					<div className="overflow-auto border bg-card rounded-lg w-fit max-w-full max-h-[80vh] sm:max-h-none">
						<div className="grid min-w-fit max-w-full sm:max-w-5xl" style={{
							gridTemplateColumns: `auto repeat(${(() => {
								// Calculate which days are actually used and trim only first/last empty days
								const allPeriods = filteredData.flatMap((course) => course.periods)
								const usedDays = Array.from(new Set(allPeriods.flatMap((period) => period.days))).sort()

								if (usedDays.length === 0) return 6 // Show all days if no data

								const minDay = Math.min(...usedDays)
								const maxDay = Math.max(...usedDays)
								const trimmedDays = []

								for (let day = minDay; day <= maxDay; day++) {
									trimmedDays.push(day)
								}

								return trimmedDays.length
							})()}, 1fr)`
						}}>
							<div className="sticky z-50 top-0 left-0 bg-background border-b font-semibold text-sm text-muted-foreground px-2 sm:px-4 py-3 text-center min-w-[80px]">
								Time
							</div>
							{(() => {
								const allPeriods = filteredData.flatMap((course) => course.periods)
								const usedDays = Array.from(new Set(allPeriods.flatMap((period) => period.days))).sort()
								const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

								if (usedDays.length === 0) {
									// Show all days if no data
									return dayNames.map((dayName, index) => (
										<div key={`header-${index}`} className="sticky z-20 top-0 bg-background border-b font-semibold text-sm text-muted-foreground px-2 sm:px-4 py-3 text-center min-w-fit sm:min-w-24">
											{dayName}
										</div>
									))
								}

								const minDay = Math.min(...usedDays)
								const maxDay = Math.max(...usedDays)
								const trimmedDays = []

								for (let day = minDay; day <= maxDay; day++) {
									trimmedDays.push(day)
								}

								return trimmedDays.map((day) => (
									<div key={`header-${day}`} className="sticky z-20 top-0 bg-background border-b font-semibold text-sm text-muted-foreground px-2 sm:px-4 py-3 text-center min-w-fit sm:min-w-24">
										{dayNames[day]}
									</div>
								))
							})()}

							{
								(() => {
									// Generate all time slots in 30-minute increments
									const allPeriods = filteredData.flatMap((course) => course.periods)
									const allStartTimes = allPeriods.map((period) => period.start)
									const allEndTimes = allPeriods.map((period) => period.end)
									const minHour = Math.floor(Math.min(...allStartTimes))
									const maxHour = Math.ceil(Math.max(...allEndTimes))

									// Get trimmed days (only remove first/last empty days)
									const usedDays = Array.from(new Set(allPeriods.flatMap((period) => period.days))).sort()
									let trimmedDays = []

									if (usedDays.length === 0) {
										// Show all days if no data
										trimmedDays = [0, 1, 2, 3, 4, 5]
									} else {
										const minDay = Math.min(...usedDays)
										const maxDay = Math.max(...usedDays)

										for (let day = minDay; day <= maxDay; day++) {
											trimmedDays.push(day)
										}
									}

									// Create 30-minute slots
									const timeSlots: number[] = []
									for (let hour = minHour; hour < maxHour; hour++) {
										timeSlots.push(hour, hour + 0.5)
									}

									// Create a map to track which cells are occupied by spanning courses
									const occupiedCells = new Set<string>()

									const allCells: JSX.Element[] = []

									timeSlots.forEach((timeSlot, index) => {
										const isHalfHour = timeSlot % 1 !== 0
										const hour = Math.floor(timeSlot)
										const isDashedRow = index % 2 !== 1

										// Time column - only show for full hours
										if (!isHalfHour) {
											allCells.push(
												<div
													key={`time-${hour}`}
													className={cn(
														"px-1 py-2 sm:p-2 sticky left-0 z-30 font-medium bg-background min-w-[80px] sm:min-w-[100px] flex items-center justify-center",
														hour !== maxHour - 1 ? 'border-b' : '',
													)}
													style={{ gridRowEnd: "span 2" }}
												>
													<div className="text-xs *:leading-none flex flex-col items-center justify-center gap-1">
														<p>
															{hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? "AM" : "PM"}
														</p>
														<span>-</span>
														<p>
															{(hour + 1) % 12 === 0 ? 12 : (hour + 1) % 12}:00{" "}
															{hour + 1 < 12 || hour + 1 === 24 ? "AM" : "PM"}
														</p>
													</div>
												</div>,
											)
										}

										// Day columns - only generate cells for trimmed days
										trimmedDays.forEach((day) => {
											const cellKey = `${timeSlot}-${day}`

											// Skip if this cell is already occupied by a spanning course
											if (occupiedCells.has(cellKey)) {
												return
											}

											const course = filteredData.find((course) =>
												course.periods.some((period) => period.start === timeSlot && period.days.includes(day)),
											)
											const period = course?.periods.find(
												(period) => period.start === timeSlot && period.days.includes(day),
											)

											const spanCount = period ? (period.end - period.start) * 2 : 1

											// Mark occupied cells for spanning courses
											if (period && spanCount > 1) {
												for (let i = 1; i < spanCount; i++) {
													const nextSlotIndex = index + i
													if (nextSlotIndex < timeSlots.length) {
														const nextTimeSlot = timeSlots[nextSlotIndex]
														occupiedCells.add(`${nextTimeSlot}-${day}`)
													}
												}
											}

											function getClassColor(index: number) {
												switch (index) {
													case 0: return "bg-red-700 dark:bg-red-900 text-white";
													case 1: return "bg-amber-700 dark:bg-amber-900 text-white";
													case 2: return "bg-lime-700 dark:bg-lime-900 text-white";
													case 3: return "bg-green-700 dark:bg-green-900 text-white";
													case 4: return "bg-teal-700 dark:bg-teal-900 text-white";
													case 5: return "bg-blue-700 dark:bg-blue-900 text-white";
													case 6: return "bg-violet-700 dark:bg-violet-900 text-white";
													case 7: return "bg-pink-700 dark:bg-pink-900 text-white";
													case 8: return "bg-rose-700 dark:bg-rose-900 text-white";
													case 9: return "bg-orange-700 dark:bg-orange-900 text-white";
													case 10: return "bg-yellow-700 dark:bg-yellow-900 text-white";
													case 11: return "bg-emerald-700 dark:bg-emerald-900 text-white";
													case 12: return "bg-sky-700 dark:bg-sky-900 text-white";
													case 14: return "bg-indigo-700 dark:bg-indigo-900 text-white";
													case 13: return "bg-cyan-700 dark:bg-cyan-900 text-white";
													case 15: return "bg-purple-700 dark:bg-purple-900 text-white";
													case 16: return "bg-fuchsia-700 dark:bg-fuchsia-900 text-white";
													default: return "bg-zinc-300 dark:bg-zinc-500 text-zinc-800 dark:text-zinc-200";
												}
											}

											allCells.push(
												<div
													key={cellKey}
													className={cn(
														"px-1 size-full min-w-[80px] sm:min-w-[100px]",
														index !== timeSlots.length - 1 && !(period && period.end === maxHour)
															? course
																? period && period.end % 1 !== 0
																	? "border-b border-dashed"
																	: "border-b"
																: isDashedRow
																	? "border-b border-dashed"
																	: "border-b"
															: "",
													)}
													style={{
														gridRowEnd: `span ${spanCount}`,
													}}
												>
													<div
														className={cn(
															"size-full w-full flex flex-col items-center justify-center text-xs sm:text-sm font-medium rounded p-1 max-w-36  *:hyphens-manual",
															course
																? getClassColor(filteredData.indexOf(course))
																: "",
														)}
													>
														{course && (
															<>
																<div className="w-full font-semibold text-center">{course.code}</div>
																<div className="w-full text-[10px] sm:text-xs text-center opacity-90">
																	{
																		(() => {
																			let courseName = filteredData.find(
																				(courseInfo) => courseInfo.code === course.code,
																			)?.name

																			if (courseName) {
																				courseName = courseName
																					.split(' ')
																					.map((word) => {
																						if (word.length >= 17) {
																							const parts = [];
																							for (let i = 0; i < word.length; i += 12) {
																								parts.push(word.substring(i, i + 12));
																							}
																							return parts.join('\u00AD'); // \u00AD is the unicode for &shy;
																						} else {
																							return word;
																						}
																					})
																					.join(' ')
																					
																			}

																			return courseName || <span className="italic text-muted-foreground">Course Name Not Found</span>
																		})()
																	}
																</div>
																<div className="w-full text-[10px] sm:text-xs text-center font-semibold">
																	{
																		course.designation
																	}
																</div>
																<div className="w-full text-[10px] sm:text-xs text-center opacity-80">
																	{
																		(() => {
																			let designator = course.designator;

																			if (designator) {
																				designator = designator
																					.split(' ')
																					.map((word) => {
																						if (word.length >= 17) {
																							const parts = [];
																							for (let i = 0; i < word.length; i += 12) {
																								parts.push(word.substring(i, i + 12));
																							}
																							return parts.join('\u00AD');
																						} else {
																							return word;
																						}
																					})
																					.join(' ');
																			}
																			return designator || <span className="italic text-muted-foreground">Designator Not Found</span>;
																		})()
																	}
																</div>
															</>
														)}
													</div>
												</div>,
											)
										})
									})

									return allCells
								})()
							}
						</div>
					</div>
			}

		</>
	)
}