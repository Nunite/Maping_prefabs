'use client'
import DropDown from '../components/DropDown'
import { useState, useEffect } from 'react'
import Tech from '@/app/assets/techdc/techdc.json'
import HomeLink from '../components/HomeLink'
import ValidDisplay from './valid.mdx'
import { KeyboardEvent } from 'react'

export default function Page() {
	const templates: Record<string, string> = Tech.templates
	const chars: Record<string, { x: number; y: number }> = Tech.chars

	const validChars = /^[a-zA-Z0-9#-\s]$/
	const valid =
		/^[a-zA-Z0-9#-\s]$|Shift|Backspace|Delete|Space|Arrow|Home|End|Tab/
	const [color, setColor] = useState('black 1')
	const [style, setStyle] = useState('techdc1')
	const [textInput, setTextInput] = useState('')
	const [copied, setCopied] = useState(false)
	const [preview, setPreview] = useState(
		'嗨！在下载下面的WAD（在页面底部）后，在上面的框中输入一些内容，然后点击按钮为TrenchBroom生成一个笔刷。\n\n笔刷将自动复制到您的剪贴板。'
	)
	const regex = {
		offset: {
			x: /(?<=\{techdc\d_\w* \[(?:-?\d*\.?\d* ){4})(.+?(?= \]))/g,
			y: /(?<=\{techdc\d_\w* \[(?:-?\d*\.?\d* ){4}.+? \] \[ (?:-?\d*\.?\d* ){3})(.+?(?= ))/g,
		},
		xVerts: /(?<=\( )(-?\d+)/g,
	}

	const generateBrush = () => {
		if (textInput == '') return
		let output = '{\n"classname" "func_detail_illusionary"\n"_noclipfaces" "1"'

		const currentStyle = Tech.styles.find((a) => a.name === style)!
		const currentColor = Tech.colors.find((a) => a.tex === color)!

		const template: string = templates[currentStyle.template]
			.replace(Tech.default.style, currentStyle.style)
			.replace(Tech.default.color, currentColor.tex)
		//
		const multiplier = currentStyle.template.includes('thin') ? 0.75 : 1

		// char loop
		for (const [index, char] of Array.from(textInput).entries()) {
			if (!Object.keys(chars).includes(char)) {
				continue
			}

			const brush = template
				// verticies
				.replace(regex.xVerts, (m) => {
					return (
						parseInt(m) +
						currentStyle.char_size * multiplier * index
					).toString()
				})

				// offsets
				.replace(
					regex.offset.x,
					(
						(chars[char].x - index * multiplier) *
						currentStyle.char_size
					).toString()
				)
				.replace(
					regex.offset.y,
					(chars[char].y * currentStyle.char_size).toString()
				)
			output += brush
		}
		output += '\n}'

		setPreview(output)
		navigator.clipboard.writeText(output)
		setCopied(true)
	}

	const handleInput = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			generateBrush()
		} else if (event.key.match(valid)) {
			return true
		} else {
			event.preventDefault()
		}
	}

	useEffect(() => {
		if (copied)
			setTimeout(() => {
				setCopied(false)
			}, 2500)
	}, [copied])

	return (
		<div className='h-screen p-3'>
			<div
				className='flex flex-col justify-between items-center
					min-w-min max-w-2xl
					h-max min-h-full max-h-full
					m-auto bg-solid-light rounded-md p-3 gap-3'
			>
				{/* USER CONTROLS */}
				<div className='flex flex-col gap-3 w-full'>
					<input
						autoFocus
						placeholder='The Quake Brown Fox'
						className='rounded-md p-2 bg-solid-dark text-lime-200 placeholder:text-lime-200/60 w-full font-atkinson outline-none focus:bg-emerald-950 transition-all'
						onKeyDown={handleInput}
						onChange={(e) => {
							setTextInput(e.target.value)
						}}
					/>
					<div className='flex w-full justify-between gap-6'>
						<div className='flex flex-col gap-1.5 w-64 font-light'>
							<DropDown
								label='color'
								items={Tech.colors.map((v) => {
									return v.tex
								})}
								itemNames={Tech.colors.map((v) => {
									return v.name
								})}
								getter={color}
								setter={setColor}
								storageKey='techdc_color'
								className='flex gap-2 lowercase [&_div]:w-16 [&_select]:font-normal'
							/>
							<DropDown
								label='style'
								items={Tech.styles.map((v) => {
									return v.name
								})}
								getter={style}
								setter={setStyle}
								storageKey='techdc_style'
								className='flex gap-2 lowercase [&_div]:w-16 [&_select]:font-normal'
							/>
						</div>
						<button
							className='flex flex-col justify-center items-center
							bg-green-700 p-2 rounded-md w-64 [&_*]:text-center [&_*]:w-full transition text-md 
							enabled:hover:bg-green-600 enabled:active:bg-green-500 enabled:active:scale-90
							disabled:opacity-70'
							onClick={generateBrush}
							disabled={textInput == ''}
						>
							{copied ? (
								<span>已复制到剪贴板！</span>
						) : (
							<>
								<span className='capitalize'>生成并复制</span>
								<span className='opacity-60 uppercase'>(回车)</span>
							</>
						)}
						</button>
					</div>
				</div>

				{/* PREVIEW */}
				<pre className='bg-solid-dark h-full p-2 text-lime-400 grow rounded-md font-mono text-sm overflow-y-scroll text-wrap w-full'>
					{preview}
				</pre>

				{/* FOOTER */}
				<footer className='flex flex-col gap-3 w-full'>
					{/* HINTS */}
					<div className='bg-solid-dark p-4 rounded-2xl flex flex-col gap-2 w-full'>
						<div>
							<h1 className='font-roboto font-thin text-xl text-center'>
									有效字符
								</h1>
							<pre className='text-center font-mono font-light text-md text-lime-200'>
								<ValidDisplay />
							</pre>
						</div>
						<hr className='border-lime-200/25' />
						<div className='flex flex-col'>
							<h2 className='font-thin text-lg text-center'>有效正则表达式</h2>
							<div className='font-robotoMono font-light text-md text-lime-200 text-center text-nowrap'>
								{String(validChars)}
							</div>
						</div>
					</div>
					{/* LINKS */}
					<div className='flex flex-col text-center'>
						<a
							className='text-lime-300 hover:text-lime-100 before:content-["🔗"] before:text-md before:mr-2'
							href='https://www.slipseer.com/index.php?resources/makkon_tech-alphanumeric-textures-fixed-color-names.409/'
						>
							makkon_tech Alphanumeric Textures - fixed color names
						</a>
						<HomeLink />
					</div>
				</footer>
			</div>
		</div>
	)
}
